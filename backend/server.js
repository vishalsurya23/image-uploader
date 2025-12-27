require("dotenv").config();
const express = require("express");
const uploadRoutes = require("./routes/uploadRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/uploads", uploadRoutes);

// MongoDB connection
async function connectWithFallback() {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = "mongodb://127.0.0.1:27017/image-uploader";

  try {
    await mongoose.connect(primaryUri);
    console.log("Connected to MongoDB (primary)");
  } catch (err) {
    console.log("Primary failed, trying local MongoDB...");
    await mongoose.connect(fallbackUri);
    console.log("Connected to MongoDB (local)");
  }

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port", process.env.PORT || 5000);
  });
}

connectWithFallback();