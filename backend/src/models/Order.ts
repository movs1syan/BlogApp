'use strict';

interface OrderAttributes {
  id: number;
  userId: number;
  paymentIntentId: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

import Sequelize, { Model } from 'sequelize';

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Order extends Model<OrderAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'client'
      });

      this.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }

  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    paymentIntentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending'
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
    modelName: 'Order',
    tableName: 'Orders'
  });

  return Order;
};