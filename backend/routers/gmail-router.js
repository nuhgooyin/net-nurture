import { Router } from "express";
import { Message } from "../models/message.js";
import { Contact } from "../models/contact.js";
import {
  authenticateGoogleToken,
  authorizeGoogleToken,
} from "../middleware/authenticate.js";

export const gmailRouter = Router();

gmailRouter.get("/fetch", authorizeGoogleToken, async (req, res) => {
  let collectedMessages = [];
  let collectedContacts = [];

  // Fetch raw Gmail messages (inbox only)
  let gmailRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${req.accessToken}` },
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
        headers: { authorization: `Bearer ${req.accessToken}` },
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

    // Construct cleaned message
    let cleanedMessage = {
      fullContent: foundMessageContent,
      previewContent: messageData.snippet,
      dateRecieved: messageDate,
      contactEmail: foundContactEmail,
      contactName: foundContactName,
    };
    collectedMessages.push(cleanedMessage);

    let cleanedContact = {
      email: foundContactEmail,
      name: foundContactName,
    };
    collectedContacts.push(cleanedContact);

    // Store the contact and associate with message
    try {
      // Check if the contact already exists
      let contact = await Contact.findOne({
        where: { email: foundContactEmail },
      });
      if (!contact) {
        // If contact doesn't exist, create a new one
        contact = await Contact.create({
          email: foundContactEmail,
          name: foundContactName,
        });
      }

      // Store the message and associate with the contact
      const newMessage = await Message.create({
        fullContent: foundMessageContent,
        previewContent: messageData.snippet,
        dateRecieved: messageDate,
        contactEmail: foundContactEmail,
        contactId: contact.id,
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
        return res.status(400).json({ error: "Cannot store message." });
      }
    }
  }

  // Return the collected messages
  return res.json({
    messages: collectedMessages,
    contacts: collectedContacts,
  });
});

gmailRouter.post("/send", authorizeGoogleToken, async (req, res) => {
  const { sender, reciever, subject, content } = req.body;
  const message =
    `From: ${sender}\r\n` +
    `To: ${reciever}\r\n` +
    `Subject: ${subject}\r\n\r\n` +
    `${content}`;

  // The body needs to be base64url encoded.
  const encodedMessage = btoa(message);
  const saferEncodedMessage = encodedMessage
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Send raw Gmail message
  let messageData = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${req.accessToken}` },
      body: JSON.stringify({
        raw: saferEncodedMessage,
      }),
    }
  ).then((res) => res.json());

  return res.json({
    messageData: messageData,
  });
});
