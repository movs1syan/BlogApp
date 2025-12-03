import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import config from "../config/config.ts"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db: Record<string, any> = {};

let sequelize: Sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

const files = fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' &&
      file !== 'models.ts' &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of files) {
  const module = await import(`./${file}`);
  const model = module.default(sequelize, DataTypes);
  db[model.name] = model;
}

// Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;