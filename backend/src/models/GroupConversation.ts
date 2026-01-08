'use strict';

import Sequelize, { Model } from "sequelize";

interface GroupConversationAttributes {
  id: number;
  conversationId: number;
  groupId: number;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class GroupConversation extends Model<GroupConversationAttributes> {
    static associate(models: any) {
      this.belongsTo(models.Conversation, {
        foreignKey: "conversationId",
      });

      this.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
    }
  }

  GroupConversation.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'GroupConversation',
    tableName: 'GroupConversations'
  });

  return GroupConversation;
};