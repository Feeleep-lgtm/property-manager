import { Router } from "express";

//import { errorMiddleware } from "../middleware/errors.js";
import { errorHandler } from "../error-handler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userController from "../Modules/Users/users.controller.js";
import { toLowerCase } from "../Configurations/case.js";

// const userController = require("../Modules/Users/users.controller.js");

const authRoutes = Router();

authRoutes.post("/signup", toLowerCase, errorHandler(userController.register));
authRoutes.post("/login", toLowerCase, userController.login);
authRoutes.get("/me", [authMiddleware], userController.me);
authRoutes.post("/logout", [authMiddleware], userController.logout);

export default authRoutes;
