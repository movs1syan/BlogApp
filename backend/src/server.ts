import express from "express";
import cors from "cors";
import { sequelize } from "./db.ts";
import dotenv from "dotenv";
import postRoutes from "./routes/postRoutes.ts";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", postRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");

    await sequelize.sync();
    console.log("Tables created successfully!");

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

startServer();
