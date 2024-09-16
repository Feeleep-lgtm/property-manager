import { prisma } from "../../../app.js";

export const getAllAgents = async () => {
  return await prisma.user.findMany({
    where: {
      userType: "AGENT",
    },
  });
};

export const getAgentById = async (id) => {
  return await prisma.agent.findUnique({
    where: { id },
  });
};

export const getPropertiesByAgentId = async (agentId) => {
  return await prisma.property.findMany({
    where: { ownerId: agentId },
  });
};

export const getPropertyByAgentAndId = async (agentId, propertyId) => {
  return await prisma.property.findFirst({
    where: {
      id: propertyId,
      ownerId: agentId,
    },
  });
};

// export const getLandlordTenants = async (landlordId) => {
//   try {
//     const properties = await prisma.property.findMany({
//       where: {
//         ownerId: landlordId,
//       },
//       include: {
//         rentals: {
//           include: {
//             tenant: true,
//           },
//         },
//       },
//     });

//     const tenants = properties.reduce((allTenants, property) => {
//       property.rentals.forEach((rental) => {
//         if (rental.tenant) {
//           allTenants.push(rental.tenant);
//         }
//       });
//       return allTenants;
//     }, []);

//     return tenants;
//   } catch (error) {
//     console.error("Error in getLandlordTenants:", error);
//     throw error;
//   }
// };
