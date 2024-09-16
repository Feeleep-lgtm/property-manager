import { uploadImageToS3 } from "../Configurations/s3.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const file = req.file;
    console.log("File received:", file); // Log received file

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pictureUrl = await uploadImageToS3(file);
    console.log("Uploaded profile picture URL:", pictureUrl); // Log uploaded picture URL

    req.body.profilePicture = pictureUrl;
    next();
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};
