const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const oilRoutes = require("./routes/oil.routes");
const contactRoutes = require("./routes/contact.routes");
const galleryRoutes = require("./routes/gallery.routes");
const { errorHandler } = require("./middleware/error.middleware");
const { seedAdmin } = require("./services/admin.service");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:8080,http://localhost:4173,http://localhost:3001").split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
  if (dbState !== 1) return res.status(503).json({ status: "unhealthy", db: "disconnected" });
  res.json({ status: "healthy", db: "connected" });
});

app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/oils", oilRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);

app.use(errorHandler);

connectDB(process.env.MONGODB_URI).then(seedAdmin).catch(console.error);

module.exports = app;
