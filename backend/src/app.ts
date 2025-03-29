import express from "express";
import dotenv from "dotenv";
import path from "path";
import calendarRoutes from "./routes/calendar";
import cors from 'cors';
dotenv.config();

const app = express();

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

app.use("/calendar", calendarRoutes);

export default app;
