const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const multer = require("multer");

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName); // Use a unique filename
  },
});

// Create Multer instance with storage configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only image files are allowed!");
    }
  },
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/products", require("./routes/productRoute"));

// Image upload route (for testing or specific use cases)
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    res
      .status(200)
      .json({ message: "File uploaded successfully!", file: req.file });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: "Error uploading file.", error: err });
  }
});

// Default error handler (for unexpected errors)
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({ error: err.message });
});

// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Port configuration and app start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
