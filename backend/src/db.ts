import dotenv from 'dotenv';

import db from "./models/index.ts"

dotenv.config();

export async function connectDB() {
  await db.sequelize.authenticate();
  console.log("Database connection successful!");
}