import { prisma } from "../../../app.js";

const calculateRentUsage = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate;
  const rentDue = end
    ? new Date(endDate)
    : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  const totalDays = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
  const daysPassed = Math.ceil((now - start) / (24 * 60 * 60 * 1000));

  const rentUsagePercentage = (daysPassed / totalDays) * 100;
  const rentRemainingPercentage = 100 - rentUsagePercentage;

  return {
    rentUsagePercentage: Math.min(rentUsagePercentage, 100),
    rentRemainingPercentage: Math.max(rentRemainingPercentage, 0),
    rentDue,
  };
};

export const getRentUsageForTenant = async (tenantId) => {
  try {
    const rental = await prisma.rental.findFirst({
      where: {
        tenantId: tenantId,
      },
    });

    if (!rental) {
      throw new Error("No rental found for this tenant");
    }

    const { startDate, endDate } = rental;
    const rentUsage = calculateRentUsage(startDate, endDate);

    return rentUsage;
  } catch (error) {
    console.error("Error in getRentUsageForTenant:", error.message);
    throw error;
  }
};

export const calculateOverdueAndUnpaid = async (landlordId) => {
  const currentDate = new Date();

  // Fetch all properties for the given landlord
  const properties = await prisma.property.findMany({
    where: {
      ownerId: landlordId,
    },
    include: {
      rentals: {
        include: {
          payment: true,
        },
      },
    },
  });

  let overdue = 0;
  let unpaid = 0;

  properties.forEach((property) => {
    property.rentals.forEach((rental) => {
      const { endDate, payment } = rental;
      const { price, paidAmount } = payment;

      // Calculate overdue amounts
      if (endDate && new Date(endDate) < currentDate) {
        overdue += price - paidAmount;
      }

      // Calculate unpaid amounts
      if (paidAmount < price) {
        unpaid += price - paidAmount;
      }
    });
  });

  return { overdue, unpaid };
};
