import { Router } from "express";
import { Scheduled } from "../models/scheduled.js";
import { Contact } from "../models/contact.js";
import { authorizeGoogleToken } from "../middleware/authenticate.js";
import { authenticate } from "../middleware/authenticate.js";
import { User } from "../models/user.js";

export const gmailRouter = Router();

//
// Given a date object, convert it to a string in the format "yyyy-mm-dd"
//
function convertDateToString(date) {
  // Get current date setup
  let today = date;
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
  date = yyyy + "-" + mm + "-" + dd;
  return date;
}

//
// Given a thread id (using gmail api), find all the people involved in the conversation
//
async function findPeople(threadId, accessToken) {
  // Extract thread messages
  let threadMessages = (
    await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`,
      {
        method: "GET",
        headers: { authorization: `${accessToken}` },
      }
    ).then((res) => res.json())
  ).messages;

  if (!threadMessages || threadMessages === undefined) {
    return [];
  }

  let people = new Set();

  for (let i = 0; i < threadMessages.length; i++) {
    let message = threadMessages[i];
    let whoSent = message.payload.headers.find(
      (header) => header.name === "From"
    ).value;

    let foundContactInfo = findContactInfo(whoSent);

    people.add(foundContactInfo[1]);
  }

  return Array.from(people);
}

function findContactInfo(header) {
  let foundContactName = "";

  for (let k = 0; k < header.length; k++) {
    if (header[k] === "<") {
      header = header.slice(k + 1, header.length - 1);
      break;
    } else {
      foundContactName += header[k];
    }
  }
  foundContactName = foundContactName.trim();
  return [foundContactName, header];
}

function processThreadData(threadData, currUserEmail) {
  // Process the messages
  let cleanedMessages = [];
  let identifiedContacts = [];
  let latestMessageDate = null;

  for (let j = 0; j < threadData.messages.length; j++) {
    let messageData = threadData.messages[j];

    // Convert epoch ms to date format
    let messageDate = new Date(parseInt(messageData.internalDate, 10));

    messageDate = convertDateToString(messageDate);

    // Find the email address of who sent the message
    let foundContactEmail = messageData.payload.headers.find(
      (header) => header.name === "From"
    ).value;
    let foundContactInfo = findContactInfo(foundContactEmail);
    let foundContactName = foundContactInfo[0];
    foundContactEmail = foundContactInfo[1];

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
    if (messageData.payload.parts && Array.isArray(messageData.payload.parts)) {
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
  return [cleanedMessages, identifiedContacts, latestMessageDate];
}

async function updateDatabase(
  identifiedContacts,
  cleanedMessages,
  latestMessageDate,
  accessToken,
  currUserEmail
) {
  let currUserId = (
    await User.findOne({
      where: { email: currUserEmail },
    })
  ).id;

  for (let h = 0; h < identifiedContacts.length; h++) {
    // Check if contact was already added to database
    let contactFound = await Contact.findOne({
      where: { email: identifiedContacts[h].email, userId: currUserId },
    });

    if (!contactFound) {
      // Create the contact in db
      await Contact.create({
        email: identifiedContacts[h].email,
        name: identifiedContacts[h].name,
        lastContacted: latestMessageDate,
        summaryRaw: JSON.stringify(cleanedMessages),
      });
    } else {
      // Update/mutate the contact's raw summary
      let parsedSummary = JSON.parse(contactFound.summaryRaw);
      parsedSummary = parsedSummary.concat(cleanedMessages);
      contactFound.summaryRaw = JSON.stringify(parsedSummary);
      await contactFound.save();

      await fetch(
        `https://api.net-nurture.com/api/llm/revise?contactId=${contactFound.id}`,
        {
          method: "PATCH",
          headers: { authorization: accessToken },
        }
      ).then((res) => res.json());
    }
  }
}

//
// Fetch Gmail conversations (aka threads), while automatically populating contacts data table
// Optional 1: Set query params "maxResults" to limit the number of threads fetched
//    Example: /api/gmail/fetch?maxResults=2
//    Note: MAXIMUM LIMIT FOR maxResults IS 500. Default is 100.
// Optional 2: Set query params "q" to filter threads fetched using Gmail search query (ex. is:sent will only return from sent box)
//    Example: /api/gmail/fetch?q=in:sent
//    Note: Default (i.e. q=undefined) will only filter out spam and trash. Add is:sent to fetch sent emails.
// Optional 3: Set query params "maxSame" to limit the number of threads processed for a particular contact.
//    Example: /api/gmail/fetch?maxSame=3
//    Note: Default (i.e. maxSame=undefined) will process a maximum of 5.
//
// Additional Notes:
// 1. Newer threads are processed first.
//
gmailRouter.get(
  "/fetch",
  authenticate,
  authorizeGoogleToken,
  async (req, res) => {
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
          headers: { authorization: `Bearer ${req.accessToken}` },
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
            headers: { authorization: `Bearer ${req.accessToken}` },
          }
        ).then((res) => res.json());

        // Set current user email
        let currUserEmail = (
          await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/profile`,
            {
              method: "GET",
              headers: { authorization: `Bearer ${req.accessToken}` },
            }
          ).then((res) => res.json())
        ).emailAddress;

        let currUserId = (
          await User.findOne({
            where: { email: currUserEmail },
          })
        ).id;

        let processedThread = processThreadData(threadData, currUserEmail);
        let cleanedMessages = processedThread[0];
        let identifiedContacts = processedThread[1];
        let latestMessageDate = processedThread[2];

        // Store them in db
        for (let k = 0; k < identifiedContacts.length; k++) {
          // Check if contact was already added to database
          let contactFound = await Contact.findOne({
            where: {
              email: identifiedContacts[k].email,
              userId: currUserId,
            },
          });

          if (!contactFound) {
            // Create the contact in db
            await Contact.create({
              email: identifiedContacts[k].email,
              name: identifiedContacts[k].name,
              lastContacted: latestMessageDate,
              summaryRaw: JSON.stringify(cleanedMessages),
              userId: req.user.id,
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
  }
);

//
// Start "watching" a user's Gmail inbox for new messages
// **Must be called for Gmail webhook monitoring to work.
//
gmailRouter.post("/watch", authorizeGoogleToken, async (req, res) => {
  // Setup webhook watch
  let googleRes = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/watch`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${req.accessToken}` },
      body: JSON.stringify({
        topicName: "projects/plated-bee-428203-a6/subscriptions/new-message",
        labelIds: ["INBOX"],
        labelFilterBehavior: "INCLUDE",
      }),
    }
  ).then((res) => res.json());

  if (googleRes.historyId !== undefined && googleRes.expiration !== undefined) {
    return res
      .status(200)
      .json({ message: "Gmail webhook setup successfully." });
  } else {
    return res.status(400).json({ error: "Cannot setup Gmail webhook." });
  }
});

//
// Endpoint for receiving push notifications from Gmail webhook
//
gmailRouter.post("/update", async (req, res) => {
  let pushNotifHistoryId = JSON.parse(atob(req.body.message.data)).historyId;
  let threadsOfInterest = new Set();

  // Extract history list
  let historyList = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${pushNotifHistoryId}`,
    {
      method: "GET",
      headers: { authorization: req.headers.authorization },
    }
  ).then((res) => res.json());

  if (historyList === undefined) {
    return res.status(400).json({ error: "No Gmail history to process." });
  }
  historyList = historyList.history;

  // Collect all threads with at least 2 people involved
  for (let i = 0; i < historyList.length; i++) {
    let historyMessages = historyList[i].messages;

    for (let j = 0; j < historyMessages.length; j++) {
      let message = historyMessages[j];
      let foundPeople = await findPeople(
        message.threadId,
        req.headers.authorization
      );
      if (foundPeople.length >= 2) {
        threadsOfInterest.add(message.threadId);
      }
    }
  }

  // Set current user email
  let currUserEmail = (
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/profile`, {
      method: "GET",
      headers: { authorization: req.headers.authorization },
    }).then((res) => res.json())
  ).emailAddress;
  threadsOfInterest = Array.from(threadsOfInterest);

  for (let g = 0; g < threadsOfInterest.length; g++) {
    // Fetch thread data
    let threadData = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadsOfInterest[g]}`,
      {
        method: "GET",
        headers: { authorization: req.headers.authorization },
      }
    ).then((res) => res.json());

    let processedThread = processThreadData(threadData, currUserEmail);
    let cleanedMessages = processedThread[0];
    let identifiedContacts = processedThread[1];
    let latestMessageDate = processedThread[2];

    updateDatabase(
      identifiedContacts,
      cleanedMessages,
      latestMessageDate,
      req.headers.authorization,
      currUserEmail
    );
  }

  return res.json({ res: threadsOfInterest });
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
