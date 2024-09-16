// src/Services/mailService.js
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import * as secrets from "../secrets.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.MAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
  // host: process.env.MAIL_HOST,
  // port: process.MAIL_PORT,
  // secure: false, // true for 465, false for other ports
  // auth: {
  //   user: process.env.MAIL_USERNAME,
  //   pass: process.env.MAIL_PASSWORD,
  // },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./src/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./src/templates"),
    extName: ".hbs",
  })
);

const sendMail = async (to, subject, template, context) => {
  try {
    const info = transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address
      to,
      subject,
      template,
      context,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: %s", error.message);
    throw new Error("Error sending email");
  }
};

export default sendMail;
