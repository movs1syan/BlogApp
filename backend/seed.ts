import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blog_app',
  password: "qwerty123",
  port: 5432,
})

async function seedDatabase() {
  try {
    const { rows: existingUsers } = await pool.query('SELECT id FROM "Users"');
    if (existingUsers.length === 0) {
      console.log('No users found. Add some users first!');
      return;
    }

    for (let i = 0; i < 10; i++) {
      const title = faker.lorem.words({ min: 3, max: 5 });
      const subtitle = faker.lorem.words({ min: 5, max: 6 });
      const description = faker.lorem.paragraph();
      const category = faker.lorem.word();
      const randomUser = existingUsers[Math.floor(Math.random() * existingUsers.length)];
      await pool.query(
        'INSERT INTO "Posts" (title, subtitle, description, category, "userId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [title, subtitle, description, category, randomUser.id]
      );
    }

    console.log('Posts seeded successfully!');
    pool.end();
  } catch (error) {
    console.error(error);
    pool.end();
  }
}

seedDatabase();