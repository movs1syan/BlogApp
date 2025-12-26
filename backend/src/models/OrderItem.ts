'use strict';

import Sequelize, { Model } from 'sequelize';

interface OrderItemsAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: any, DataTypes: typeof Sequelize.DataTypes) => {
  class OrderItem extends Model<OrderItemsAttributes> {
    static associate(models: any) {
      this.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });

      this.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }

  OrderItem.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
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
    modelName: 'OrderItem',
    tableName: 'OrderItems'
  });

  return OrderItem;
};