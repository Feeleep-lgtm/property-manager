import { Router } from "express";
import * as paymentController from "../Modules/Payment/paymentController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";

const paymentRouter = Router();

paymentRouter.post("/", authMiddleware, paymentController.addPayment);
paymentRouter.get(
  "/",
  [authMiddleware],
  authorize("TENANT"),
  paymentController.getPaymentsByTenantId
);
paymentRouter.get(
  "/summary",
  [authMiddleware],
  authorize("TENANT"),
  paymentController.getTotalPaidAndBalance
);

paymentRouter.get(
  "/landlord",
  authMiddleware,
  paymentController.getAllPaymentsForLandlord
);
export default paymentRouter;
