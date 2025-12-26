'use strict';

/** @type {import('sequelize-cli').Migration} */
export default  {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderItems', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        id: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderItems', 'orderId');
  }
};
