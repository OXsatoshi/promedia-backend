const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev")); // HTTP request logger

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling (must be last middleware)
app.use(errorHandler);

module.exports = app;
