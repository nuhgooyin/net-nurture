import { Sequelize } from "sequelize";
/*
import dotenv from "dotenv";
import config from "./config/config.js";

dotenv.config(); // Load environment variables

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

export const sequelize = new Sequelize(dbConfig);*/
export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "microblog.sqlite",
  });
  
