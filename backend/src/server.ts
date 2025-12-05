import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connectDB } from "./db.ts";
import postRoutes from "./routes/postRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.use("/uploads/avatars", express.static(path.join(process.cwd(), "uploads", "avatars")));
app.use("/uploads/images", express.static(path.join(process.cwd(), "uploads", "images")));

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));

connectDB().catch((err) => console.log(`Failed to connect to DB: ${err}`));