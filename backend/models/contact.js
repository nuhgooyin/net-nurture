import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

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

User.belongsTo(Contact, { foreignKey: "userID" });
User.hasMany(Contact, { foreignKey: "userID" });
