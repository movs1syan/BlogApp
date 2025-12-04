'use strict';

import Sequelize, { Model } from "sequelize";

interface FollowsAttributes {
  id: number;
  followerId: number;
  followingId: number;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Follows extends Model<FollowsAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, { foreignKey: 'followerId', as: 'followerUser' });
      this.belongsTo(models.User, { foreignKey: 'followingId', as: 'followingUser' });
    }
  }

  Follows.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Follows',
  });

  return Follows;
};