import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Contact = sequelize.define("Contact", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
