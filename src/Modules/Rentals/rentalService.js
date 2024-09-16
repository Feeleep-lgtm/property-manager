import { connect } from "http2";
import { prisma } from "../../../app.js";

export const rentProperty = async (paymentData) => {
  const {
    tenantId,
    propertyId,
    accountNumber,
    bankAccountName,
    notes,
    price,
    bank,
  } = paymentData;

  try {
    console.log("Starting payment creation...");

    // Create payment and rental in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          accountNumber,
          bankAccountName,
          notes,
          price,
          bank,
          userId: tenantId,
          propertyId,
        },
      });

      console.log("Payment created:", payment);

      // Create rental record
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // Assuming a 1-year rental period

      const rental = await prisma.rental.create({
        data: {
          isPaid: true,
          tenantId,
          propertyId,
          startDate,
          endDate,
          paymentId: payment.id,
        },
      });

      console.log("Rental created:", rental);

      return { payment, rental };
    });

    return result;
  } catch (error) {
    console.error("Error creating payment and rental:", error);
    throw error;
  }
};

export const renewRent = async (paymentData, rental) => {
  const {
    tenantId,
    propertyId,
    accountNumber,
    bankAccountName,
    notes,
    price,
    bank,
  } = paymentData;

  const result = await prisma.$transaction(async (prisma) => {
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        accountNumber,
        bankAccountName,
        notes,
        price,
        bank,
        userId: tenantId,
        propertyId,
      },
    });

    let updatedRental;

    if (rental) {
      // Renew rental
      updatedRental = await prisma.rental.update({
        where: { id: rental.id },
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          isPaid: true,
          paymentId: payment.id,
        },
      });
    } else {
      // Create new rental record
      updatedRental = await prisma.rental.create({
        data: {
          tenantId,
          propertyId,
          isPaid: true,
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          paymentId: payment.id,
        },
      });
    }

    return { payment, rental: updatedRental };
  });

  return result;
};

export const getTenantProperties = async (tenantId) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { tenantId },
      include: {
        property: {
          include: {
            owner: true,
          },
        },
      },
    });

    return rentals;
  } catch (error) {
    console.error("Error fetching tenant's properties:", error);
    throw new Error("Could not retrieve properties");
  }
};
