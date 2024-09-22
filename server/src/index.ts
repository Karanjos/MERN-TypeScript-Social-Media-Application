import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import authRouter from "./routes/authRoutes";
import cors from "cors";

import dbConnect from "./config/dbConnect";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/auth", authRouter);

const server = createServer(app);

const PORT: string | number = process.env.PORT || 5000;

dbConnect();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
