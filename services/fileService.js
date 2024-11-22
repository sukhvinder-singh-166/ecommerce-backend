const { GridFSBucket } = require("mongodb");

const getFiles = async (conn) => {
  try {
    return await conn.db.collection("uploads.files").find().toArray();
  } catch (err) {
    throw new Error("Error retrieving files: " + err.message);
  }
};

const getFileByFilename = async (conn, filename) => {
  try {
    return await conn.db.collection("uploads.files").findOne({ filename });
  } catch (err) {
    throw new Error("Error retrieving file: " + err.message);
  }
};

const downloadFile = (conn, filename, gfsBucket, res) => {
  const file = conn.db.collection("uploads.files").findOne({ filename });
  if (file && file.contentType && file.contentType.startsWith("image/")) {
    const readStream = gfsBucket.openDownloadStreamByName(file.filename);
    res.set("Content-Type", file.contentType);
    readStream.pipe(res);
  } else {
    res.status(400).json({ message: "File is not an image" });
  }
};

module.exports = {
  getFiles,
  getFileByFilename,
  downloadFile,
};
