import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import gigRoutes from "./routes/gigRoutes";
import bidRoutes from "./routes/bidRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(   // cors config
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (_req, res) => {   // health route
  res.json({ status: "GigFlow is Live" });
});

app.use("/api/auth", authRoutes);   // auth routes
app.use("/api/gigs", gigRoutes);   // gig routes
app.use("/api/bids", bidRoutes);   // bid routes

export default app;
