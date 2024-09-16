import { prisma } from "../../../app.js";

export const getAllLandlords = async () => {
  return await prisma.user.findMany({
    where: {
      userType: "LANDLORD",
    },
  });
};

export const getLandlordById = async (id) => {
  return await prisma.landlord.findUnique({
    where: { id },
  });
};

export const getLandlordProperties = async (landlordId) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        ownerId: landlordId,
      },
    });
    return properties;
  } catch (error) {
    throw new Error("Error retrieving properties");
  }
};

export const getLandlordPropertyById = async (propertyId, landlordId) => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: landlordId,
      },
    });
    return property;
  } catch (error) {
    throw new Error("Error retrieving property");
  }
};

export const getTenantsByLandlordId = async (landlordId) => {
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
      },
    });

    if (!properties || properties.length === 0) {
      throw new Error("No properties found for this landlord");
    }

    const tenants = new Set();
    properties.forEach((property) => {
      property.rentals.forEach((rental) => {
        if (rental.tenant) {
          tenants.add(rental.tenant);
        }
      });
    });

    return Array.from(tenants);
  } catch (error) {
    console.error("Error in getTenantsByLandlordId:", error.message);
    throw error;
  }
};

const getDateRange = (filter) => {
  const now = new Date();
  switch (filter) {
    case "today":
      return {
        startDate: new Date(now.setHours(0, 0, 0, 0)),
        endDate: new Date(now.setHours(23, 59, 59, 999)),
      };
    case "recent":
      const recentDate = new Date();
      recentDate.setDate(now.getDate() - 7); // Last 7 days
      return { startDate: recentDate, endDate: now };
    case "last_month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: startOfMonth, endDate: endOfMonth };
    default:
      return { startDate: null, endDate: null };
  }
};
export const getLandlordDashboardData = async (landlordId, filter) => {
  try {
    const { startDate, endDate } = getDateRange(filter);

    // Total number of properties
    const totalProperties = await prisma.property.count({
      where: { ownerId: landlordId },
    });

    // Total number of units
    const totalUnits = await prisma.property.aggregate({
      _sum: { unit: true },
      where: { ownerId: landlordId },
    });

    // Total number of tenants
    const totalTenants = await prisma.rental.count({
      where: {
        property: { ownerId: landlordId },
      },
    });

    // Recent payments with date filter
    const paymentFilter =
      startDate && endDate
        ? {
            property: { ownerId: landlordId },
            createdAt: { gte: startDate, lte: endDate },
          }
        : { property: { ownerId: landlordId } };

    const recentPayments = await prisma.payment.findMany({
      where: paymentFilter,
      orderBy: { createdAt: "desc" },
      take: 10, // Adjust the number of recent payments to fetch as needed
    });

    return {
      totalProperties,
      totalUnits: totalUnits._sum.unit || 0,
      totalTenants,
      recentPayments,
    };
  } catch (error) {
    console.error("Error fetching landlord dashboard data:", error.message);
    throw error;
  }
};

// Define a function to determine if a tenant is almost due or overdue for rent
const isAlmostDueOrOverdue = (endDate) => {
  const now = new Date();
  const dueDate = new Date(endDate);
  const daysLeft = (dueDate - now) / (1000 * 60 * 60 * 24);

  if (daysLeft <= 0) {
    return "overdue";
  } else if (daysLeft <= 7) {
    return "almost due";
  }
  return null;
};

export const fetchOverdueAndAlmostDueTenants = async (landlordId) => {
  const isAlmostDueOrOverdue = (endDate) => {
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

    return endDate >= today && endDate < oneYearFromNow;
  };
  try {
    // Fetch properties owned by the landlord
    const properties = await prisma.property.findMany({
      where: { ownerId: landlordId },
      include: { rentals: { include: { tenant: true } } },
    });

    const tenantsStatus = properties
      .flatMap((property) =>
        property.rentals.flatMap((rental) => {
          const status = isAlmostDueOrOverdue(rental.endDate);
          if (status) {
            return {
              tenantId: rental.tenant.id,
              tenantName: rental.tenant.name,
              propertyId: property.id,
              propertyName: property.address,
            };
          }
          return null;
        })
      )
      .filter((tenant) => tenant !== null);

    return tenantsStatus;
  } catch (error) {
    console.error(
      "Error fetching overdue and almost due tenants:",
      error.message
    );
    throw error;
  }
};
