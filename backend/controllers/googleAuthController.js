import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

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

export const verifyGoogleCode = async (req, res) => {
  const { code } = req.body;
  console.log(code);
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
    console.log("got ticket");
    const payload = ticket.getPayload();
    console.log("got payload");

    // Use the authenticated user from req.user
    const user = req.user;
    console.log("Found user: ", user);

    if (user) {
      user.email = payload.email;
      console.log("Updated email: ", user.email);
      await user.save();
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
