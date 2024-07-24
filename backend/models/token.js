import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Token = sequelize.define("Token", {
  googleAccessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  googleRefreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenExpiry: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Establish association with User model
User.hasOne(Token, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Token.belongsTo(User, {
  foreignKey: "userId",
});
