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
    console.error("Error in authenticate middleware:", error); // Debug log
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const authorizeGoogleToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.accessToken = accessToken;
  next();
};

export const authenticateBackgroundJob = async (req, res, next) => {
  const { userId } = req.body; // Assuming userId is provided in the request body

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findByPk(userId, {
      include: [Token],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
