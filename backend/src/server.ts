import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.ts";
import postRoutes from "./routes/postRoutes.ts";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", postRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));

connectDB().catch((err) => console.log(`Failed to connect to DB: ${err}`));