'use strict';

import Sequelize, { Model } from "sequelize";

interface FollowsAttributes {
  id: number;
  reqSenderId: number;
  reqTakerId: number;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Friend extends Model<FollowsAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, { foreignKey: 'reqSenderId', as: 'reqSenderUser' });
      this.belongsTo(models.User, { foreignKey: 'reqTakerId', as: 'reqTakerUser' });
    }
  }

  Friend.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reqSenderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    reqTakerId: {
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
    modelName: 'Friend',
  });

  return Friend;
};