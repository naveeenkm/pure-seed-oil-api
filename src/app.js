const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const reviewRoutes = require("./routes/review.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:8080").split(",").map(o => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

module.exports = app;
