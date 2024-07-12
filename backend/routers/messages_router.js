import { Message } from "../models/message.js";
import { Router } from "express";

export const messagesRouter = Router();


messagesRouter.get("/", async (req, res, next) => {
  const messages = await Message.findAll({
    limit: 5,
  });
  return res.json({ messages });
});

