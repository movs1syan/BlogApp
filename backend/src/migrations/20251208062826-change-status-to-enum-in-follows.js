'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Follows', 'status',{
      type: Sequelize.ENUM('pending', 'accepted'),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Follows', 'status', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
