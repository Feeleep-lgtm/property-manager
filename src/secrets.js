import dotenv from "dotenv";

dotenv.config({ path: ".env" });
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AMAZON_S3_BUCKET = process.env.AMAZON_S3_BUCKET;
export const AMAZON_S3_ACCESS_SECRET = process.env.AMAZON_S3_ACCESS_SECRET;
export const AMAZON_S3_ACCESS_KEY_ID = process.env.AMAZON_S3_ACCESS_KEY_ID;
export const MAIL = process.env.MAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const MAIL_SENDER = process.env.MAIL_SENDER;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
