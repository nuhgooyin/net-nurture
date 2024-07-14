import fetch from "node-fetch";

export const verifyGoogleToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
  const data = await response.json();

  if (data.error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.cookie("googleToken", token, {
    httpOnly: true, // Cookie cannot be accessed via JavaScript
    secure: true, // Ensure to use HTTPS
    sameSite: "Strict", // Prevent CSRF attacks
    maxAge: 3600000, // 1 hour in milliseconds
  });

  res.json({ message: "Token verified and stored" });
};
