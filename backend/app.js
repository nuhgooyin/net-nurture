import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./datasource.js";
import { gmailRouter } from "./routers/gmail-router.js";
import db from "./models/modelLoader.js";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;
export const app = express();

app.use(bodyParser.json());
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

// Use authentication routes

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
