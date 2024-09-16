import AWS from "aws-sdk";
//import * as secrets from "../secrets.js";
import dotenv from "dotenv";

dotenv.config();

//import { S3Client } from "@aws-sdk/client-s3";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_S3_ACCESS_SECRET,
  },
});

export const uploadImageToS3 = async (file) => {
  const params = {
    Bucket: process.env.AMAZON_S3_BUCKET,
    Key: `properties/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const command = new PutObjectCommand(params);
  const uploadResult = await s3.send(command);

  console.log("S3 Upload Result:", uploadResult);

  if (
    !uploadResult ||
    !uploadResult.$metadata ||
    uploadResult.$metadata.httpStatusCode !== 200
  ) {
    throw new Error("Failed to upload image to S3");
  }

  return `https://${params.Bucket}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${params.Key}`;
};

export default s3;

//export default s3;

// const s3 = new S3Client({
//   region: process.env.AWS_BUCKET_REGION,
//   credentials: {
//     accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AMAZON_S3_ACCESS_SECRET,
//   },
// });

// AWS.config.update({
//   accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AMAZON_S3_ACCESS_SECRET,
//   // region: process.env.AWS_BUCKET_REGION,
// });

// const s3 = new AWS.S3();
// {
//   accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AMAZON_S3_ACCESS_SECRET,
//   region: process.env.AWS_BUCKET_REGION,
// });
