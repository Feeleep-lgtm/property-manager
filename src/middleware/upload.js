import { uploadImageToS3 } from "../Configurations/s3.js";

const uploadMiddleware = async (req, res, next) => {
  try {
    const files = req.files;
    console.log("Files received:", files); // Log received files

    if (!files || !files.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = files.map((file) => uploadImageToS3(file));
    const pictureUrls = await Promise.all(uploadPromises);
    console.log("Uploaded picture URLs:", pictureUrls); // Log uploaded picture URLs

    req.body.pictures = pictureUrls;
    next();
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Error uploading images" });
  }
};

export default uploadMiddleware;
