import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { prisma } from "../../../app.js";
import sendMail from "../../services/email.service.js";

export const sendComplain = async (
  userId,
  property,
  contactCaretaker,
  complain
) => {
  try {
    const newComplaint = await prisma.complain.create({
      data: {
        userId, // Associate the complaint with the user
        property,
        contactCaretaker,
        complain,
      },
    });
    // Send the complaint email
    await sendMail(
      "folaremidixon@gmail.com",
      "New User Complaint",
      "complain",
      {
        property,
        contactCaretaker,
        complain,
      }
    );
    return newComplaint;
  } catch (error) {
    console.error("Error handling complaint:", error);
    throw new Error("Failed to handle complaint");
  }
};
