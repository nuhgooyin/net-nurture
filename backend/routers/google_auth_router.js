import { Router } from "express";
import { verifyGoogleToken } from "../controllers/googleAuthController.js";

export const googleAuthRouter = Router();

googleAuthRouter.post("/verify-token", verifyGoogleToken);
