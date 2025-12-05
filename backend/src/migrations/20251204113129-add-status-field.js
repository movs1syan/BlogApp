'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('Follows', "status", {
       type: "pending" | "accepted",
       defaultValue: "pending",
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Follows', "status");
  }
};
