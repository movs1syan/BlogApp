'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('GroupMembers', 'GroupUsers')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('GroupUsers', 'GroupMembers')
  }
};
