import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { sequelize } from "./datasource.js";
import { gmailRouter } from "./routers/gmail-router.js";
import { googleAuthRouter } from "./routers/google_auth_router.js";
//import db from "./models/modelLoader.js";
import cors from "cors";

import { usersRouter } from "./routers/users_router.js";
import { contactRouter } from "./routers/contact-router.js";
dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;
export const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // Parse cookies
app.use(express.static("static"));

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use("/api/gmail", gmailRouter);
app.use("/api/contacts", contactRouter);

// Use authentication routes
app.use("/api/users", usersRouter);
app.use("/api/google-auth", googleAuthRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
