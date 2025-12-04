'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.renameTable("Followers", "Follows");
  },

  async down(queryInterface) {
    await queryInterface.renameTable("Follows", "Followers");
  }
};
