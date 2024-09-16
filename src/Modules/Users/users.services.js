import { prisma } from "../../../app.js";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";
import { JWT_SECRET } from "../../secrets.js";
import crypto from "crypto";
//import mailOptions from "../../utils/sendMail.js";
import sendMail from "../../services/email.service.js";
import { BadRequests } from "../../exception/bad-request.js";
import { ErrorCodes } from "../../exception/root.js";
import { NotFound } from "../../exception/not-found.js";


export const signUp = async ({
  userName,
  phoneNumber,
  email,
  fullName,
  password,
  passwordConfirm,
  userType,
  referralCode,
}) => {
  if (password !== passwordConfirm) {
    throw new BadRequests(
      "Passwords do not match",
      ErrorCodes.INCORRECT_PASSWORD
    );
  }
  const user = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        userName,
        phoneNumber,
        email,
        fullName,
        password: hashSync(password, 10),
        passwordConfirm: hashSync(password, 10),
        userType: userType,
      },
    });

    if (referralCode) {
      const property = await prisma.property.findUnique({
        where: { referralCode },
      });

      if (property) {
        await prisma.rental.create({
          data: {
            tenant: user.id,
            property: property.id,
            startDate: null,
            endDate: null,
            property: {
              connect: {
                id: property.id,
              },
            },
            tenant: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }
    }

    return user;
  });
 
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  user.password = undefined;
  user.passwordConfirm = undefined;
  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new NotFound("User not found", ErrorCodes.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequests("Incorrect password", ErrorCodes.INCORRECT_PASSWORD);
  }
  //await addUserToFirestore(user);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  user.password = undefined;
  user.passwordConfirm = undefined;
  return { user, token };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  users.password = undefined;
  users.passwordConfirm = undefined;
  return users;
};

export const updateUser = async (userId, data) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user profile");
  }
};

export const deleteUser = async (userId) => {
  // First, ensure the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete the user
  await prisma.user.delete({
    where: { id: userId },
  });
};

export const forgotPassword = async (email, userName, resetCode) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const resetCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit code
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        resetCode,
        resetCodeExpires,
      },
    });
    // Send email using nodemailer
    // const mailOptions = {
    //   from: process.env.MAIL_FROM_ADDRESS,
    //   to: email,
    //   subject: "FORGOT PASSWORD",
    //   template: "forgot-password",
    //   context: {
    //     userName: user.userName,
    //     resetCode: resetCode,
    //   },
    // };
    //const resetUrl = `http://localhost:3092/reset-password?token=${user.resetToken}`;
    await sendMail(email, "Password Reset", "forgot-password", {
      userName,
      resetCode,
    });
    return { message: "Reset code sent to email" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email, newPassword, passwordConfirm) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (newPassword !== passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        password: hashSync(newPassword, 10), // Hash the new password
        resetCode: null, // Clear reset code
        resetCodeExpires: null, // Clear reset code expiration
      },
    });

    return { message: "Password has been reset successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verifyResetCode = async (email, resetCode) => {
  try {
    // Ensure the email and code are being checked correctly
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        resetCode,
        resetCodeExpires: {
          gt: new Date(), // Ensure code is not expired
        },
      },
    });

    if (!user) {
      return false; // Invalid or expired code
    }

    return true; // Valid reset code
  } catch (error) {
    console.error("Error in verifyResetCode:", error);
    throw new Error("Verification failed");
  }
};

export const updateProfile = async (userId, updateData) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
