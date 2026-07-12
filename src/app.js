const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const reviewRoutes = require("./routes/review.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:8080").split(",").map(o => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected on every request (critical for Lambda)
app.use(async (req, res, next) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState !== 1) {
    return res.status(503).json({ status: "unhealthy", db: "disconnected" });
  }
  res.json({ status: "healthy", db: "connected" });
});

app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

module.exports = app;
