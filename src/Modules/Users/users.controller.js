import { SignUpSchema, loginSchema } from "../../schemas/user.js";
import { BadRequests } from "../../exception/bad-request.js";
import { ErrorCodes } from "../../exception/root.js";
import { BadRequestError } from "../../exception/root.js";
import * as userService from "./users.services.js";
import { addToBlacklist } from "../../services/blacklistService.js";
import { UnprocessableEntity } from "../../exception/validation.js";
import { NotFound } from "../../exception/not-found.js";
import { uploadProfilePicture } from "../../middleware/uploadPicture.js";

import { prisma } from "../../../app.js";

export const register = async (req, res, next) => {
  try {
    SignUpSchema.parse(req.body);
    const {
      userName,
      phoneNumber,
      email,
      fullName,
      password,
      passwordConfirm,
      userType,
      referralCode,
    } = req.body;

    const { user, token } = await userService.signUp({
      userName,
      phoneNumber,
      email,
      fullName,
      password,
      passwordConfirm,
      userType,
      referralCode,
    });

    await addUserToFirestore(user);
    res.header("x-auth-token", token).json({ user, token });
  } catch (error) {
    if (error.code === "P2002" && error.meta.target.includes("email")) {
      next(
        new BadRequests("email already exists", ErrorCodes.USER_ALREADY_EXISTS)
      );
    }
    if (error.code === "P2002" && error.meta.target.includes("userName")) {
      next(
        new BadRequests(
          "Username already exists",
          ErrorCodes.USER_ALREADY_EXISTS
        )
      );
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  loginSchema.parse(req.body);
  const { email, password } = req.body;

  try {
    const { user, token } = await userService.login({ email, password });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const me = async (req, res) => {
  res.json(req.user);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user is authenticated and their ID is stored in req.user
    const { phoneNumber, email, address, governmentId, fullName } = req.body;

    const updatedUser = await userService.updateUser(userId, {
      phoneNumber,
      email,
      address,
      governmentId,
      fullName,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    // Add this line for debugging

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Add the token to the blacklist
    await addToBlacklist(token);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Delete related bookmarks first
    await prisma.bookmark.deleteMany({
      where: {
        property: {
          ownerId: userId,
        },
      },
    });

    // Then delete related properties
    await prisma.property.deleteMany({
      where: {
        ownerId: userId,
      },
    });

    // Finally, delete the user
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      message: "User and related records deleted successfully",
      deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id; // Get authenticated user's ID
    const picture = req.body.profilePicture;

    const updatedUser = await userService.updateProfile(userId, { picture });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile picture:", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await userService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyReset = async (req, res) => {
  try {
    const { email, resetCode } = req.body;

    // Validate input
    if (!email || !resetCode) {
      return res
        .status(400)
        .json({ error: "Email and reset code are required" });
    }

    const result = await userService.verifyResetCode(email, resetCode);

    if (result) {
      req.session.resetEmail = email; // Store email in session
      res.status(200).json({ message: "Reset code is valid" });
    } else {
      res.status(400).json({ error: "Invalid or expired reset code" });
    }
  } catch (error) {
    console.error("Error in verifyReset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, passwordConfirm } = req.body;
    const email = req.session.resetEmail; // Get email from session

    if (!email) {
      return res.status(400).json({
        error: "Session expired. Please verify the reset code again.",
      });
    }

    const result = await userService.resetPassword(
      email,
      password,
      passwordConfirm
    );
    req.session.resetEmail = null; // Clear the session after password reset
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
