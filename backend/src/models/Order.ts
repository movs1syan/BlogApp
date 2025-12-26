'use strict';

import Sequelize, { Model } from 'sequelize';

interface OrderAttributes {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class Order extends Model<OrderAttributes> {
    static associate(models: any) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'customer'
      });

      this.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'orderedItems'
      });
    }
  }

  Order.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders'
  });

  return Order;
};