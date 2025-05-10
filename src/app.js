const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev")); // HTTP request logger

app.use(cookieParser()); // <-- Required to populate req.cookies
// Routes
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use(errorHandler);

module.exports = app;
