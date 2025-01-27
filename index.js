import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION 🚚! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import { configDotenv } from "dotenv";
import { connectDB } from "./utils/db.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

import userRoutes from "./routes/userRoutes.js";
import { protect } from "./controllers/authController.js";

import rateLimit from "express-rate-limit";

configDotenv();

app.get("/", protect, (req, res, next) => {
  console.log("cookies", req.cookies);
  res.json({ message: "Hello from the feedbacia server" });
});

connectDB();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on PORT`, process.env.PORT || 3000);
});

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Cannot find ${req.originalUrl} on this server! testtt`, 404)
  );
});

app.use(globalErrorHandler);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION 🔥! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
