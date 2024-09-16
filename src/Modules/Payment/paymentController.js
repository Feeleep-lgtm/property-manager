import { createPayment, getPaymentsByRental } from "./paymentService.js";
import * as paymentService from "./paymentService.js";

export const addPayment = async (req, res, next) => {
  const { propertyId, bankAccountName, accountNumber, amount, notes } =
    req.body;

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newPayment = await prisma.payment.create({
      data: {
        propertyId,
        bankAccountName,
        accountNumber,
        amount,
        notes,
      },
    });

    res.status(200).json({
      message: "Offline payment initiated successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error in initiateOfflinePayment:", error);
    next(error);
  }
};

export const getPaymentsByTenantId = async (req, res) => {
  console.log("req.user:", req.user); // Log the req.user object to debug

  if (req.user.userType !== "TENANT") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only tenants can view their payments" });
  }

  const tenantId = req.user.id;
  console.log(tenantId);

  if (!tenantId) {
    return res.status(400).json({ message: "Tenant ID is required" });
  }

  try {
    const payments = await paymentService.getPaymentsByTenantId(tenantId);
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(404).json({ message: "Error fetching payments" });
  }
};

export const getTotalPaidAndBalance = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const paymentDetails = await paymentService.getTotalPaidAndBalance(
      tenantId
    );
    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error("Error fetching tenant payment details:", error);
    res.status(404).json({
      message: "",
    });
  }
};

export const getAllPaymentsForLandlord = async (req, res) => {
  try {
    const landlordId = req.user.id;
    // Assuming landlord ID is attached to req.user by the auth middleware

    if (!landlordId) {
      return res.status(400).json({ message: "Landlord ID is required" });
    }

    const payments = await paymentService.getAllPaymentsForLandlord(landlordId);

    res.status(200).json(payments);
  } catch (error) {
    res.status(404).json({ message: "Error fetching payments" });
  }
};
