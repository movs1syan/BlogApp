'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("Friends", "followerId", "reqSenderId");
    await queryInterface.renameColumn("Friends", "followingId", "reqTakerId");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("Friends", "reqSenderId", "followerId");
    await queryInterface.renameColumn("Friends", "reqTakerId", "followingId");
  }
};
