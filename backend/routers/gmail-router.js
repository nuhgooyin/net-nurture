import { Router } from "express";
import { Scheduled } from "../models/scheduled.js";
import { Contact } from "../models/contact.js";
import { authorizeGoogleToken } from "../middleware/authenticate.js";
import { authenticate } from "../middleware/authenticate.js";

export const gmailRouter = Router();

//
// Fetch Gmail conversations (aka threads), while automatically populating contacts data table
// Optional 1: Set query params "maxResults" to limit the number of threads fetched
//    Example: /api/gmail/fetch?maxResults=2
//    Note: MAXIMUM LIMIT FOR maxResults IS 500. Default is 100.
// Optional 2: Set query params "q" to filter threads fetched using Gmail search query (ex. is:sent will only return from sent box)
//    Example: /api/gmail/fetch?q=is:sent
//    Note: Default (i.e. q=undefined) will only filter out spam and trash. Add is:sent to fetch sent emails.
// Optional 3: Set query params "maxSame" to limit the number of threads processed for a particular contact.
//    Example: /api/gmail/fetch?maxSame=3
//    Note: Default (i.e. maxSame=undefined) will process a maximum of 5.
//
// Additional Notes:
// 1. Newer threads are processed first.
//
gmailRouter.get("/fetch", async (req, res) => {
  try {
    let q = "";
    let maxSame = 5;
    // Set default maxResults to 100 if not provided
    if (!req.query.maxResults || req.query.maxResults === undefined) {
      req.query.maxResults = 100;
    }
    // Set default q to none if not provided
    if (req.query.q && req.query.q !== undefined) {
      q = `&q=${req.query.q}`;
    }
    // Set default maxSame to 5 if not provided
    if (req.query.maxSame && req.query.maxSame !== undefined) {
      maxSame = req.query.maxSame;
    }

    // Fetch raw Gmail threads (inbox only, no spam)
    let threads = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=${req.query.maxResults}${q}`,
      {
        method: "GET",
        headers: { authorization: `${req.headers.authorization}` },
      }
    ).then((res) => res.json());

    if (!threads || threads === undefined) {
      return res.status(400).json({ error: "Cannot fetch Gmail threads." });
    } else {
      threads = threads.threads;
    }
    let createdContacts = {};
    for (let i = 0; i < threads.length; i++) {
      let thread = threads[i];

      // Fetch thread data
      let threadData = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${thread.id}`,
        {
          method: "GET",
          headers: { authorization: `${req.headers.authorization}` },
        }
      ).then((res) => res.json());

      // Set current user email
      let currUserEmail = (
        await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/profile`, {
          method: "GET",
          headers: { authorization: `${req.headers.authorization}` },
        }).then((res) => res.json())
      ).emailAddress;

      // Process the messages
      let cleanedMessages = [];
      let identifiedContacts = [];
      let latestMessageDate = null;

      for (let j = 0; j < threadData.messages.length; j++) {
        let messageData = threadData.messages[j];

        // Convert epoch ms to date format
        let messageDate = new Date(parseInt(messageData.internalDate, 10));

        // Get current date setup
        let today = messageDate;
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        // Add leading zero if the day is less than 10
        if (dd < 10) {
          dd = "0" + dd;
        }

        // Add leading zero if the month is less than 10
        if (mm < 10) {
          mm = "0" + mm;
        }

        // Format date
        messageDate = yyyy + "-" + mm + "-" + dd;

        // Find the email address of who sent the message
        let foundContactEmail = messageData.payload.headers.find(
          (header) => header.name === "From"
        ).value;
        let foundContactName = "";

        for (let k = 0; k < foundContactEmail.length; k++) {
          if (foundContactEmail[k] === "<") {
            foundContactEmail = foundContactEmail.slice(
              k + 1,
              foundContactEmail.length - 1
            );
            break;
          } else {
            foundContactName += foundContactEmail[k];
          }
        }
        foundContactName = foundContactName.trim();

        // Check if contact has already been identified & is not the current user themselves
        if (foundContactEmail !== currUserEmail) {
          let found = false;
          identifiedContacts.forEach((contact) => {
            if (contact.email === foundContactEmail) {
              found = true;
            }
          });
          if (!found) {
            // If contact doesn't exist, create a new one
            identifiedContacts.push({
              email: foundContactEmail,
              name: foundContactName,
            });
          }
        }

        // Check if messageData.payload.parts exists and is an array
        let foundMessageContent = "";
        if (
          messageData.payload.parts &&
          Array.isArray(messageData.payload.parts)
        ) {
          foundMessageContent = atob(
            messageData.payload.parts[0].body.data
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          );
        } else {
          // Handle cases where the message body is in a different format
          foundMessageContent = atob(
            messageData.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
          );
        }

        latestMessageDate = messageDate;

        // Construct cleaned message
        let cleanedMessage = {
          content: foundMessageContent,
          snippet: messageData.snippet,
          date: messageDate,
          contactEmail: foundContactEmail,
          contactName: foundContactName,
        };
        cleanedMessages.push(cleanedMessage);
      }

      // Store them in db
      for (let k = 0; k < identifiedContacts.length; k++) {
        // Check if contact was already added to database
        let contactFound = await Contact.findOne({
          where: { email: identifiedContacts[k].email },
        });

        if (!contactFound) {
          // Create the contact in db
          await Contact.create({
            email: identifiedContacts[k].email,
            name: identifiedContacts[k].name,
            lastContacted: latestMessageDate,
            summaryRaw: JSON.stringify(cleanedMessages),
          });
          createdContacts[identifiedContacts[k].email] = 1;
        } else {
          // Check if threshold maxSame is reached
          if (createdContacts[identifiedContacts[k].email] < maxSame) {
            createdContacts[identifiedContacts[k].email] += 1;
            // Update/mutate the contact's raw summary
            let parsedSummary = JSON.parse(contactFound.summaryRaw);
            parsedSummary = parsedSummary.concat(cleanedMessages);
            contactFound.summaryRaw = JSON.stringify(parsedSummary);
            await contactFound.save();
          }
        }
      }
    }

    // Return threads processed and contacts created
    return res.json({
      threadsProcessed: threads,
      contactsCreated: createdContacts,
    });
  } catch (e) {
    console.log(e);
    if (e.name === "SequelizeForeignKeyConstraintError") {
      return res.status(422).json({ error: "Invalid foreign key." });
    } else if (e.name === "SequelizeValidationError") {
      return res.status(422).json({
        error: "Invalid input parameters.",
      });
    } else {
      return res.status(400).json({ error: "Cannot fetch Gmail threads." });
    }
  }
});

gmailRouter.post("/schedule", authenticate, async (req, res) => {
  const { sender, reciever, subject, content, schedule } = req.body;
  let schedMessage = null;
  // Store the scheduled message
  try {
    // Store the message.
    const scheduledMessage = await Scheduled.create({
      from: sender,
      to: reciever,
      subject: subject,
      content: content,
      scheduledTimeStamp: schedule,
      userId: req.user.id,
    });

    schedMessage = scheduledMessage;
  } catch (e) {
    console.log(e);
    if (e.name === "SequelizeForeignKeyConstraintError") {
      return res.status(422).json({ error: "Invalid foreign key." });
    } else if (e.name === "SequelizeValidationError") {
      return res.status(422).json({
        error: "Invalid input parameters.",
      });
    } else {
      return res.status(400).json({ error: "Cannot store scheduled message." });
    }
  }

  return res.json({
    scheduledMessage: schedMessage,
  });
});
