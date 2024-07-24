import { OAuth2Client } from "google-auth-library";
import { Token } from "../models/token.js";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export const verifyGoogleCode = async (req, res) => {
  const { code } = req.body;
  const csrfHeader = req.headers["x-requested-with"];

  if (csrfHeader !== "XmlHttpRequest") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  try {
    const r = await client.getToken(code);
    const { tokens } = r;

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const user = req.user;

    if (user) {
      user.email = payload.email;
      await user.save();

      let token = await Token.findOne({
        where: { userId: user.id },
      });

      if (!token) {
        // If token doesn't exist, create a new one
        token = await Token.create({
          userId: user.id,
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
        });
      } else {
        // Update existing token
        token.googleAccessToken = tokens.access_token;
        token.googleRefreshToken = tokens.refresh_token;
        token.tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);
        await token.save();
      }

      res.cookie("accessToken", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      res.status(200).json({ message: "Successfully authenticated" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in verifyGoogleCode: ", error);
    res.status(401).json({ error: "Invalid code" });
  }
};

export const refreshGoogleAccessToken = async (token) => {
  if (new Date() > token.tokenExpiry) {
    const response = await client.refreshToken(token.googleRefreshToken);
    const newTokens = response.tokens;

    token.googleAccessToken = newTokens.access_token;
    token.tokenExpiry = new Date(Date.now() + newTokens.expires_in * 1000); // Convert expiry to milliseconds
    await token.save();
  }

  return token.googleAccessToken;
};

export const signOut = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Signed out successfully" });
};
