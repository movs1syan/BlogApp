'use strict';
import Sequelize, { Model } from "sequelize";

interface GroupMemberAttributes {
  id: number;
  groupId: number;
  userId: number;
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class GroupMember extends Model {
    static associate(models: any) {
      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group"
      });

      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "member"
      });
    }
  }

  GroupMember.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'),
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
    modelName: 'GroupMember',
    tableName: 'GroupMembers'
  });

  return GroupMember;
};