import { Router } from "express";
import { Contact } from "../models/contact.js";
import { User } from "../models/user.js";
import dotenv from "dotenv";
import { authenticate } from "../middleware/authenticate.js";

dotenv.config();

export const contactRouter = Router();

// Get all contacts for the user based on email
contactRouter.get("/", authenticate, async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { userId: req.user.id } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Create a new contact for the user based on email
contactRouter.post("/", async (req, res) => {
  const userEmail = req.body.userEmail;
  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, name, lastContacted, summary, summaryRaw } = req.body;
    const contact = await Contact.create({
      email,
      name,
      lastContacted,
      summary,
      summaryRaw,
      userId: user.id,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// Update a contact for the user based on email
contactRouter.put("/:id", async (req, res) => {
  const userEmail = req.body.userEmail;
  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id } = req.params;
    const { email, name, lastContacted, summary, summaryRaw } = req.body;
    const contact = await Contact.findOne({
      where: { id, userId: user.id },
    });
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    await contact.update({ email, name, lastContacted, summary, summaryRaw });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// Delete a contact for the user based on email
contactRouter.delete("/:id", async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id } = req.params;
    const contact = await Contact.findOne({
      where: { id, userId: user.id },
    });
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    await contact.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});
