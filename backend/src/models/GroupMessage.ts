'use strict';

import Sequelize, { Model } from "sequelize";

interface GroupMessageAttributes {
  id: number;
  senderId: number;
  groupId: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class GroupMessage extends Model<GroupMessageAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "messageSender"
      });

      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "groupOfMessage"
      });
    }
  }
  GroupMessage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Groups",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'GroupMessage',
    tableName: 'GroupMessages'
  });
  return GroupMessage;
};