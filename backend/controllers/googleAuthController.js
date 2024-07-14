import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    res.cookie("googleToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag only in production
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Successfully authenticated" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const signOut = (req, res) => {
  res.clearCookie("googleToken");
  res.status(200).json({ message: "Signed out successfully" });
};
