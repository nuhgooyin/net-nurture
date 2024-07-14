import { Router } from "express";
import {
  verifyGoogleToken,
  signOut,
} from "../controllers/googleAuthController.js";

export const googleAuthRouter = Router();

googleAuthRouter.post("/verify-token", verifyGoogleToken);
googleAuthRouter.post("/signout", signOut);
