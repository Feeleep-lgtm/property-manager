import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AMAZON_S3_BUCKET,
    Key: `${Date.now()}-${file.property}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const uploadResult = await s3.upload(params).promise();
  console.log("Uploaded to S3:", uploadResult.Location);
  return uploadResult.Location;
};
