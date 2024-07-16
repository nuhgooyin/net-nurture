import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const authenticateGoogleToken = (req, res, next) => {
  const token = req.cookies.googleToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.googleToken = token;
  req.accessToken = req.cookies.accessToken;
  next();
};

export const authorizeGoogleToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.accessToken = accessToken;
  next();
};
