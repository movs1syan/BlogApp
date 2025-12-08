'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable("Follows", "Friends");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("Friends", "Follows");
  }
};
