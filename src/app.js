const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const reviewRoutes = require("./routes/review.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:8080").split(",").map(o => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (dbState !== 1) {
    return res.status(503).json({ status: "unhealthy", db: "disconnected" });
  }
  res.json({ status: "healthy", db: "connected" });
});

app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

module.exports = app;
