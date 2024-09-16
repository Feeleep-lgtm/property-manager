import { Router } from "express";
import * as rentalController from "../Modules/Rentals/rentalController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import logRequestData from "../middleware/logger.js";
import {
  getTenantRentUsage,
  OverdueAndUnpaid,
} from "../Modules/Rent-track/rentController.js";

const rentalRoute = Router();
rentalRoute.post(
  "/:propertyId",
  authMiddleware,
  logRequestData,
  authorize("TENANT"),
  rentalController.rentProperty
);

rentalRoute.post(
  "/:propertyId",
  authMiddleware,
  logRequestData,
  authorize("TENANT"),
  rentalController.renewRent
);

rentalRoute.get(
  "/rent-track",
  [authMiddleware],
  authorize("ADMIN", "TENANT"),
  getTenantRentUsage
);

rentalRoute.get(
  "/calculate-overdue-unpaid",
  authMiddleware,
  authorize("LANDLORD", "PROPERTY_MANAGER"),
  OverdueAndUnpaid
);

rentalRoute.get(
  "/properties",
  authMiddleware,
  authorize("ADMIN", "TENANT"),
  rentalController.listTenantProperties
);

export default rentalRoute;
