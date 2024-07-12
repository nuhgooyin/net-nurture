import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Message = sequelize.define("Message", {
  fullContent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  previewContent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateRecieved: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
