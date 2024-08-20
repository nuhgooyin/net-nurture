import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Contact = sequelize.define("Contact", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastContacted: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // JSON stringified data of messages collected from Gmail API (Messages should be ordered from latest to earliest)
  summaryRaw: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Contact.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Contact, { foreignKey: "userId" });
