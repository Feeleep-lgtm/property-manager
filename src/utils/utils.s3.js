//import s3 from "../Configurations/s3.js";
import * as secrets from "../secrets.js";
// import dotenv from "dotenv";

// dotenv.config({ path: ".env" });

export const uploadFile = (file) => {
  const params = {
    Bucket: secrets.AMAZON_S3_BUCKET,
    Key: `${Date.now()}-${file.property}`, // File name you want to save as in S3
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  return s3.upload(params).promise();
};
