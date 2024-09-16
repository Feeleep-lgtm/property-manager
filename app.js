import express from "express";
import { PORT } from "./src/secrets.js";
import appRoute from "./src/routes/index.js";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import cors from "cors";
import { errorMiddleware } from "./src/middleware/errors.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({ credentials: true, origin: "*" }));
app.options("*", cors());
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/api/v1", appRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Jodex Property");
});

app.all("*", (req, res, next) => {
  const err = new Error(`can't find this URL`);
  err.status = "fail";
});

export const prisma = new PrismaClient({
  log: ["query"],
});

/* The code `app.use(errorMiddleware);` is using the `errorMiddleware` function to handle errors in the
Express application. This middleware function will be called whenever an error occurs during the
request-response cycle. It helps in centralizing error handling logic and providing a consistent way
to handle errors across the application. */
app.use(errorMiddleware);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Catch uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
