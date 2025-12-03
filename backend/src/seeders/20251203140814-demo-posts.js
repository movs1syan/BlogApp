'use strict';

/** @type {import('sequelize-cli').Migration} */
import { faker } from '@faker-js/faker';
import { Sequelize } from "sequelize";

export default {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length) {
      throw new Error("Seeder failed: No users found.");
    }


    const posts = [];

    for (let i = 0; i < 10; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      posts.push({
        title: faker.lorem.words(3),
        subtitle: faker.lorem.words({ min: 5, max: 6 }),
        description: faker.lorem.paragraph(),
        category: faker.lorem.word(),
        image: null,
        userId: randomUser.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Posts', posts, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
