import { Router } from "express";
import * as propertyController from "../Modules/Property/propertyController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import uploadMiddleware from "../middleware/upload.js";
import logRequestData from "../middleware/logger.js";
//import { landlordMiddleware } from "../middleware/landlordMiddleware.js";

const propertyRouter = Router();

propertyRouter.post(
  "/",
  upload.array("pictures"),
  logRequestData,
  uploadMiddleware,
  [authMiddleware],
  authorize("LANDLORD", "AGENT", "PROPERTY_MANAGER", "ADMIN"),
  propertyController.addProperty
);
propertyRouter.get("/search", authMiddleware, propertyController.filter);
propertyRouter.get(
  "/code/:propertyId",
  authMiddleware,
  authorize("LANDLORD", "PROPERTY_MANAGER"),
  propertyController.getReferralCode
);
propertyRouter.get(
  "/getProperties",
  authMiddleware,
  authorize("ADMIN", "TENANT"),
  propertyController.getAllProperties
);
propertyRouter.get(
  "/:id",
  [authMiddleware],
  authorize("ADMIN", "TENANT"),
  propertyController.getPropertyById
);
// rentalRoute.get(
//   "/properties",
//   authMiddleware,
//   authorize("ADMIN", "TENANT"),
//   rentalController.listTenantProperties
// );

export default propertyRouter;
