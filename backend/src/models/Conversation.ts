'use strict';

import Sequelize, { Model } from "sequelize";

interface ConversationAttributes {
  id: number;
  type: 'private' | 'group';
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Conversation extends Model<ConversationAttributes> {
    static associate(models: any) {
      this.hasOne(models.GroupConversation, {
        foreignKey: "conversationId",
      });

      this.belongsToMany(models.User, {
        through: "UserConversations",
        foreignKey: "conversationId",
      });
    }
  }

  Conversation.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('private', 'group'),
      allowNull: false
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: false
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
    modelName: 'Conversation',
    tableName: 'Conversations'
  });

  return Conversation;
};