import { Router } from "express";
import {
  verifyGoogleToken,
  verifyGoogleCode,
  signOut,
} from "../controllers/googleAuthController.js";
import {
  authenticate,
  authorizeGoogleToken,
} from "../middleware/authenticate.js";

export const googleAuthRouter = Router();

googleAuthRouter.post("/verify-token", verifyGoogleToken);
googleAuthRouter.post("/signout", signOut);
googleAuthRouter.post("/verify-code", authenticate, verifyGoogleCode);

googleAuthRouter.get("/verify-status", authorizeGoogleToken, (req, res) => {
  res.json({ message: "Authenticated" });
});
