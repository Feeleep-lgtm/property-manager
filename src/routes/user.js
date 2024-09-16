import { Router } from "express";
import multer from "multer";

import * as userController from "../Modules/Users/users.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
//import { sendForgotPasswordEmail } from "../Modules/Users/users.services.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadProfilePicture } from "../middleware/uploadPicture.js";

//import { errorHandler } from "../error-handler.js";

const userRoute = Router();

// userRoute.put(
//   "/update",
//   authenticate,
//   upload.single("profilePicture"),
//   userController.updateUser
// );
userRoute.get("/", userController.getAllUsers);
userRoute.put("/", [authMiddleware], userController.updateUser);
userRoute.post(
  "/forgot-password",
  authMiddleware,
  userController.sendForgotPasswordEmail
);
userRoute.post("/reset-password", authMiddleware, userController.resetPassword);
userRoute.post("/verify-reset", authMiddleware, userController.verifyReset);
userRoute.delete("/delete", [authMiddleware], userController.deleteUser);
userRoute.put(
  "/profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture,
  authMiddleware,
  userController.updateProfilePicture
);

export default userRoute;
