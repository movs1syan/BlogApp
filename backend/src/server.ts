import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.ts";
import postRoutes from "./routes/postRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));

connectDB().catch((err) => console.log(`Failed to connect to DB: ${err}`));