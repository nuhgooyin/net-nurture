import cron from "node-cron";
import fetch from "node-fetch";
import { Scheduled } from "../models/scheduled.js";
import { User } from "../models/user.js";
import { Token } from "../models/token.js";
import { Op } from "sequelize";
import { refreshGoogleAccessToken } from "../controllers/googleAuthController.js";

const sendScheduledEmails = async () => {
  console.log("Querying messages to send");
  const currentTime = Date.now();
  const scheduledMessages = await Scheduled.findAll({
    order: [["scheduledTimeStamp", "ASC"]],
    where: {
      scheduledTimeStamp: {
        [Op.lte]: currentTime,
      },
    },
    include: [User],
  });

  for (const message of scheduledMessages) {
    try {
      const user = message.User;
      const token = await Token.findOne({ where: { userId: user.id } });

      if (!token) {
        console.log(`No token found for user ${user.id}`);
        continue;
      }

      const accessToken = await refreshGoogleAccessToken(token);

      const newMessage =
        `From: ${message.from}\r\n` +
        `To: ${message.to}\r\n` +
        `Subject: ${message.subject}\r\n\r\n` +
        `${message.content}`;

      // The body needs to be base64url encoded.
      const encodedMessage = Buffer.from(newMessage).toString("base64");
      const saferEncodedMessage = encodedMessage
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Send raw Gmail message
      await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: { authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            raw: saferEncodedMessage,
          }),
        }
      );

      await message.destroy();
      console.log(`Email sent for scheduled message ID ${message.id}`);
    } catch (error) {
      console.error(
        `Failed to send email for scheduled message ID ${message.id}: `,
        error
      );
    }
  }
  console.log("Sending these messages");
  console.log(scheduledMessages);
};

cron.schedule("* * * * *", sendScheduledEmails);
