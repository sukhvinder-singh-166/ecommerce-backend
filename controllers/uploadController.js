const fileService = require("../services/fileService");

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File upload failed." });
  }
  res.status(201).send({
    file: req.file,
    message: "File uploaded successfully",
  });
};

const getAllFiles = async (req, res) => {
  try {
    const files = await fileService.getFiles(req.conn);
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }
    res.status(200).json(files);
  } catch (err) {
    console.error("Error retrieving files:", err);
    res.status(500).json({ message: "Error retrieving files", error: err });
  }
};

const getFileByFilename = async (req, res) => {
  try {
    const file = await fileService.getFileByFilename(
      req.conn,
      req.params.filename
    );
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json(file);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ message: "Error retrieving file", error: err });
  }
};

const renderImage = (req, res) => {
  try {
    fileService.downloadFile(req.conn, req.params.filename, req.gfsBucket, res);
  } catch (err) {
    console.error("Error rendering image:", err);
    res.status(500).json({ message: "Error rendering image", error: err });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  getFileByFilename,
  renderImage,
};
