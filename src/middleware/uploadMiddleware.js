import multer from "multer";
import { uploadImageToS3 } from "../Configurations/s3.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
