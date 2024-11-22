const express = require("express");
const fileController = require("../controllers/uploadController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/files", fileController.getAllFiles);
router.get("/files/:filename", fileController.getFileByFilename);
router.get("/image/:filename", fileController.renderImage);

module.exports = router;
