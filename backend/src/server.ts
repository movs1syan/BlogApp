import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import {connectDB} from "./db.ts";
import postRoutes from "./routes/postRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import stripeRoutes from "./routes/stripeRoutes.ts";
import { initSocket } from "./socket/index.ts";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

app.use("/webhook", stripeRoutes);
app.use(cors());

app.use("/uploads/avatars", express.static(path.join(process.cwd(), "uploads", "avatars")));
app.use("/uploads/images", express.static(path.join(process.cwd(), "uploads", "images")));
app.use("/uploads/products", express.static(path.join(process.cwd(), "uploads", "products")));

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

const server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

initSocket(io);

server.listen(port, () => console.log(`Server is running on port ${port}`));

connectDB().catch((err) => console.log(`Failed to connect to DB: ${err}`));