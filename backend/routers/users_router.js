import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Router } from "express";
import dotenv from "dotenv";
import { authenticate } from "../middleware/authenticate.js";

dotenv.config();

export const usersRouter = Router();

// Sign-up route
usersRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Username is already taken" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Sign-in route
usersRouter.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Wrong username or password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Lax", // Helps mitigate CSRF attacks
    });
    res.json({ message: "Signed in", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sign-out route
usersRouter.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("accessToken");
  res.json({ message: "Signed out" });
});

usersRouter.get("/verify-auth", authenticate, (req, res) => {
  res.json({ message: "Authenticated" });
});
