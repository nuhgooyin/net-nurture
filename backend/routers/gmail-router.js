import { Router } from "express";
import { Message } from "../models/message.js";
import { authenticateGoogleToken } from "../middleware/authenticate.js";

export const gmailRouter = Router();

gmailRouter.get("/fetch", authenticateGoogleToken, async (req, res) => {
  let collectedMessages = [];

  // Fetch raw Gmail messages
  let gmailRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${req.googleToken}` },
    }
  ).then((res) => res.json());

  // Check if any messages were found
  if (gmailRes.messages === undefined || gmailRes.messages.length === 0) {
    return res.status(422).json({
      error: "No messages found",
    });
  }

  // "Clean" the messages
  let gmailResMessages = gmailRes.messages;

  for (let i = 0; i < gmailResMessages.length; i++) {
    let message = gmailResMessages[i];
    // Fetch message data
    let messageData = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${req.googleToken}` },
      }
    ).then((res) => res.json());

    // Convert epoch ms to date format
    let messageDate = new Date(parseInt(messageData.internalDate, 10));

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

    // Find the content of the message, and display it as a string
    let foundMessageContent = atob(
      messageData.payload.parts[0].body.data
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    );

    // Construct cleaned message & add to collected messages
    let cleanedMessage = {
      fullContent: foundMessageContent,
      previewContent: messageData.snippet,
      dateRecieved: messageDate,
      contactEmail: foundContactEmail,
      contactName: foundContactName,
    };
    collectedMessages.push(cleanedMessage);

    // Store the messages on the database
    try {
      await Message.create(cleanedMessage);
    } catch (e) {
      console.log(e);
      if (e.name === "SequelizeForeignKeyConstraintError") {
        return res.status(422).json({ error: "Invalid foreign key." });
      } else if (e.name === "SequelizeValidationError") {
        return res.status(422).json({
          error: "Invalid input parameters.",
        });
      } else {
        return res.status(400).json({ error: "Cannot store message." });
      }
    }
  }

  // Return the collected messages
  return res.json({
    messages: collectedMessages,
  });
});
