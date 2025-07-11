import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/userRoutes.js";

dotenv.config({
  path: "./env", // giving directory to access .env variables
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // Limit the size of JSON payloads to 16kb and Parses incoming request bodies that are JSON formatted, and attaches them to req.body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parses incoming requests with URL-encoded payloads
app.use(express.static("public")); // Serves static files from the "public" directory
app.use(cookieParser());

app.use("/", router); // Mount user routes at this base path

export { app };
