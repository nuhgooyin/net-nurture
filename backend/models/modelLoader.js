"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import { sequelize } from "../datasource.js"; // Import the sequelize instance
import { Sequelize } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach(async (file) => {
    const { default: model } = await import(path.join(__dirname, file));
    db[model.name] = model(sequelize, Sequelize.DataTypes);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
