import { Router } from "express";
import * as landlordController from "../Modules/Landlord/landlordController.js";
//import { landlordMiddleware } from "../middleware/landlordMiddleware.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";

const landlordRoute = Router();
landlordRoute.get(
  "/",
  [authMiddleware],
  authorize("ADMIN", "LANDLORD", "PROPERTY_MANAGER"),
  landlordController.getAllLandlords
);

landlordRoute.get(
  "/tenants",
  authMiddleware,
  authorize("ADMIN", "LANDLORD", "PROPERTY_MANAGER"),
  landlordController.getLandlordTenants
);

landlordRoute.get(
  "/:propertyId/tenants",
  authMiddleware,
  authorize("ADMIN", "LANDLORD", "PROPERTY_MANAGER"),
  landlordController.getTenantsForProperty
);

landlordRoute.get(
  "/:landlordId",
  [authMiddleware],
  authorize("ADMIN", "LANDLORD", "TENANT", "PROPERTY_MANAGER"),
  landlordController.getLandlordById
);

landlordRoute.get(
  "/:landlordId/properties",
  [authMiddleware],
  authorize("ADMIN", "TENANT", "LANDLORD", "PROPERTY_MANAGER"),
  landlordController.getLandlordProperties
);

landlordRoute.get(
  "/property/:propertyId",
  [authMiddleware],
  authorize("ADMIN", "LANDLORD", "TENANT", "PROPERTY_MANAGER"),
  landlordController.getLandlordProperty
);

landlordRoute.get(
  "/dashboard/:ownerId",
  [authMiddleware],
  authorize("ADMIN", "LANDLORD", "PROPERTY_MANAGER"),
  landlordController.getLandlordDashboard
);
landlordRoute.get(
  "/tenant/due",
  [authMiddleware],
  authorize("LANDLORD", "PROPERTY_MANAGER"),
  landlordController.getOverdueAndAlmostDueTenants
);
// landlordRoute.get(
//   "calculate-overdue-unpaid",
//   authMiddleware,
//   authorize("LANDLORD"),
//   landlordController.OverdueAndUnpaid
// );

export default landlordRoute;
