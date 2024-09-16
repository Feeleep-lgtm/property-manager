import { prisma } from "../../../app.js";

export const createPayment = async (data) => {
  try {
    const newPayment = await prisma.payment.create({
      data,
    });
    return newPayment;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsByTenantId = async (tenantId) => {
  const payments = await prisma.payment.findMany({
    where: {
      tenant: {
        id: tenantId,
      },
    },
    select: {
      price: true,
      notes: true,
      createdAt: true, // Optional: Include the date of the payment
    },
    orderBy: {
      createdAt: "desc", // Optional: Order payments by date
    },
  });

  return payments;
};

export const getPaymentsByRental = async (rentalId) => {
  return await prisma.payment.findMany({
    where: { rentalId },
  });
};

export const getTotalPaidAndBalance = async (tenantId) => {
  // Fetch all payments made by the tenant
  const payments = await prisma.payment.findMany({
    where: {
      tenant: {
        id: tenantId,
      },
    },
    include: {
      property: true,
    },
  });

  if (payments.length === 0) {
    return {
      totalPaid: null,
      balanceRemaining: null,
    };
  }

  // Calculate total paid and remaining balance for each property
  const propertyBalances = payments.reduce((acc, payment) => {
    const propertyId = payment.propertyId;
    if (!acc[propertyId]) {
      acc[propertyId] = {
        totalPaid: 0,
        totalOwed: payment.property.price,
      };
    }
    acc[propertyId].totalPaid += payment.price;
    return acc;
  }, {});

  // Get the overall total paid and balance remaining
  const totalPaid = Object.values(propertyBalances).reduce(
    (acc, { totalPaid }) => acc + totalPaid,
    0
  );
  const totalOwed = Object.values(propertyBalances).reduce(
    (acc, { totalOwed }) => acc + totalOwed,
    0
  );
  const balanceRemaining = totalOwed - totalPaid;

  return { totalPaid, balanceRemaining };
};

export const getAllPaymentsForLandlord = async (landlordId) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        ownerId: landlordId,
      },
      include: {
        rentals: {
          include: {
            tenant: true,
          },
        },
        Payment: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!properties || properties.length === 0) {
      throw new Error("No properties found for this landlord");
    }

    const payments = properties.flatMap((property) => property.Payment);

    return payments;
  } catch (error) {
    console.log(error);
  }
};
