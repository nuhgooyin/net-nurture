import { Router } from "express";
import { Contact } from "../models/contact.js";

export const contactRouter = Router();

contactRouter.get("/", async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});
