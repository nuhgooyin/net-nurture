import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Scheduled = sequelize.define("Scheduled", {
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scheduledTimeStamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

