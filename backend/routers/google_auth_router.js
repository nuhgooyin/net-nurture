import { Router } from "express";
import {
  verifyGoogleCode,
  signOut,
} from "../controllers/googleAuthController.js";
import { authenticate } from "../middleware/authenticate.js";

export const googleAuthRouter = Router();

googleAuthRouter.post("/signout", signOut);
googleAuthRouter.post("/verify-code", authenticate, verifyGoogleCode);
