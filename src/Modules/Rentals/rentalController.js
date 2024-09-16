// controllers/paymentController.js
import * as rentalService from "./rentalService.js";

export const rentProperty = async (req, res, next) => {
  try {
    const { accountNumber, bankAccountName, notes, price, bank } = req.body;
    const tenantId = req.user.id; // Extracting tenantId from the authenticated user
    const { propertyId } = req.params; // Extracting propertyId from the request parameters

    console.log(
      "Received request to initiate offline payment for tenant:",
      tenantId,
      "and property:",
      propertyId
    );

    // Validate input data
    if (
      !tenantId ||
      !propertyId ||
      !accountNumber ||
      !bankAccountName ||
      !price ||
      !bank
    ) {
      console.log("Validation failed for input data");
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const paymentData = {
      tenantId,
      propertyId,
      accountNumber,
      bankAccountName,
      notes,
      price,
      bank,
    };

    const result = await rentalService.rentProperty(paymentData);
    console.log("Payment and rental creation successful:", result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error initiating offline payment:", error);
    next(error);
  }
};

export const renewRent = async (req, res) => {
  try {
    const { accountNumber, bankAccountName, notes, price, bank } = req.body;
    const tenantId = req.user.id;
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const rental = await prisma.rental.findFirst({
      where: { tenantId, propertyId },
    });

    const paymentData = {
      accountNumber,
      bankAccountName,
      notes,
      price,
      bank,
      userId: tenantId,
      propertyId,
    };

    const result = await rentalService.rentOrRenewProperty(paymentData, rental);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listTenantProperties = async (req, res) => {
  try {
    const tenantId = req.user.id;

    console.log("Tenant ID:", tenantId);

    const rentals = await rentalService.getTenantProperties(tenantId);

    console.log("Rentals:", rentals);

    if (!rentals || rentals.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found for this tenant" });
    }

    return res.status(200).json(rentals);
  } catch (error) {
    console.error("Error listing tenant's properties:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
