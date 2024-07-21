import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cron from "node-cron";
import { sequelize } from "./datasource.js";
import { gmailRouter } from "./routers/gmail-router.js";
import { messagesRouter } from "./routers/messages_router.js";
import { googleAuthRouter } from "./routers/google_auth_router.js";
//import db from "./models/modelLoader.js";
import cors from "cors";

import { usersRouter } from "./routers/users_router.js";
import { scheduledRouter } from "./routers/scheduled_router.js";
import { contactRouter } from "./routers/contact-router.js";
import { Scheduled } from "./models/scheduled.js";
import { Op } from "sequelize";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;
export const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // Parse cookies
app.use(express.static("static"));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use("/api/gmail", gmailRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/schedule", contactRouter);

// Use authentication routes
app.use("/api/users", usersRouter);
app.use("/api/google-auth", googleAuthRouter);

cron.schedule('* * * * *', async () => {
  console.log('Querying messages to send');
  const currentTime = Date.now();
  const scheduledMessages = await Scheduled.findAll({
    order: [["scheduledTimeStamp", "ASC"]],
    where: {
      scheduledTimeStamp: {
        [Op.lte]: currentTime,
      },
    },
  });
  for (let i = 0; i < scheduledMessages.length; i++) {
    const newMessage =
      `From: ${scheduledMessages[i].from}\r\n` +
      `To: ${scheduledMessages[i].to}\r\n` +
      `Subject: ${scheduledMessages[i].subject}\r\n\r\n` +
      `${scheduledMessages[i].content}`;

    // The body needs to be base64url encoded.
    const encodedMessage = btoa(newMessage);
    const saferEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send raw Gmail message
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${scheduledMessages[i].accessToken}` },
        body: JSON.stringify({
          raw: saferEncodedMessage,
        }),
      }
    )
    scheduledMessages[i].destroy();
  }
  console.log('Sending these messages');
  console.log(scheduledMessages);
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
