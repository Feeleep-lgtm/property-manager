import { Router } from "express";

//import { errorMiddleware } from "../middleware/errors.js";
//import { errorHandler } from "../error-handler.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import * as bookmarkController from "../Modules/Bookmarks/bookmarkController.js";

const bookmarkRoute = Router();

bookmarkRoute.post(
  "/",
  authMiddleware,
  authorize("TENANT"),
  bookmarkController.addBookmark
);
bookmarkRoute.delete(
  "/",
  authMiddleware,
  authorize("TENANT"),
  bookmarkController.deleteBookmark
);
bookmarkRoute.get(
  "/bookmarks",
  authMiddleware,
  authorize("TENANT"),
  bookmarkController.getBookmarksForTenantController
);

export default bookmarkRoute;
