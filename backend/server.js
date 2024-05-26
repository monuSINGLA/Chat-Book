import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js"; // Import existing app and server instances
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import job from "./cron/cron.js";
import blockUserAgent from "./middleware/blockUserAgent.js";


// config
dotenv.config();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(blockUserAgent);

// Determine the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (frontend build)
const frontendPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// Fallback route to serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Connect to database
connectDB()
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${server.address().port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

  job.start()
