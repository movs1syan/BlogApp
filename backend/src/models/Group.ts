'use strict';
import Sequelize, { Model } from "sequelize";

interface GroupAttributes {
  id: number;
  name: string;
  adminId: number;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Group extends Model<GroupAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: "adminId",
        as: "groupCreator"
      });

      this.belongsToMany(models.User, {
        through: "GroupMember",
        foreignKey: "groupId",
        as: "members"
      });
    }
  }

  Group.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
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
    tableName: 'Groups',
    modelName: 'Group',
  });

  return Group;
};