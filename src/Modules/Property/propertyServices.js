//import { property } from "lodash";
import { prisma } from "../../../app.js";
import { uploadImageToS3 } from "../../Configurations/s3.js";
import { nanoid } from "nanoid";

export const createReferralCode = () => {
  return nanoid(10);
};

export const createProperty = async (propertyData, ownerId) => {
  const referralCode = createReferralCode();

  const {
    unit,
    city,
    state,
    zipCode,
    address,
    description,
    rooms,
    bath,
    kitchen,
    diningRoom,
    houseType,
    price,
    pictures,

    // additionalCharges = [],
  } = propertyData;

  // let totalRent = parseFloat(price);

  // if (additionalCharges.length > 0) {
  //   additionalCharges.forEach((charge) => {
  //     totalRent += parseFloat(charge.amount);
  //   });
  // }
  console.log(referralCode);

  const property = await prisma.property.create({
    data: {
      referralCode,
      unit: Number(unit),
      city,
      state,
      zipCode: Number(zipCode),
      address,
      description,
      rooms: Number(rooms),
      bath: Number(bath),
      kitchen: Number(kitchen),
      diningRoom: Number(diningRoom),
      houseType,
      price: parseFloat(price),
      pictures,

      owner: { connect: { id: ownerId } },
    },
  });

  return property;
};

export const getAllProperties = async () => {
  try {
    return await prisma.property.findMany({
      include: {
        owner: {
          select: {
            userName: true,
            email: true,
          },
        },
        rentals: {
          include: {
            tenant: {
              select: {
                userName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    // throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            userName: true,
            email: true,
            picture: true,
            userType: true,
          },
        },
        rentals: {
          include: {
            tenant: {
              select: {
                userName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return property;
  } catch (error) {
    throw new Error("Error fetching property by ID");
  }
};

export const searchProperties = async (filters) => {
  const { priceMin, priceMax, houseType, rooms, bath, city, state, keyword } =
    filters;

  let query = {
    where: {
      AND: [],
    },
  };

  if (keyword) {
    query.where.AND.push({
      OR: [
        { description: { contains: keyword, mode: "insensitive" } },
        { address: { contains: keyword, mode: "insensitive" } },
        { city: { contains: keyword, mode: "insensitive" } },
        { state: { contains: keyword, mode: "insensitive" } },
        { houseType: { contains: keyword, mode: "insensitive" } },
      ],
    });
  }

  // Price range
  if (priceMin !== undefined || priceMax !== undefined) {
    query.where.AND.push({
      price: {
        ...(priceMin !== undefined && { gte: parseFloat(priceMin) }),
        ...(priceMax !== undefined && { lte: parseFloat(priceMax) }),
      },
    });
  }

  // House type
  if (houseType) {
    query.where.AND.push({
      houseType: {
        equals: houseType,
        mode: "insensitive", // Case-insensitive search
      },
    });
  }

  // Rooms
  if (rooms !== undefined) {
    query.where.AND.push({
      rooms: {
        gte: parseInt(rooms),
      },
    });
  }

  // Bathrooms
  if (bath !== undefined) {
    query.where.AND.push({
      bath: {
        gte: parseInt(bath),
      },
    });
  }
  if (city) {
    query.where.city = city;
  }

  if (state) {
    query.where.state = state;
  }
  // Location-based search
  // if (
  //   latitude !== undefined &&
  //   longitude !== undefined &&
  //   radius !== undefined
  // ) {
  //   // Convert radius from km to degrees (approximate)
  //   const latRadius = radius / 111.32;
  //   const lonRadius = radius / (111.32 * Math.cos((latitude * Math.PI) / 180));

  //   query.where.AND.push({
  //     latitude: {
  //       gte: parseFloat(latitude) - latRadius,
  //       lte: parseFloat(latitude) + latRadius,
  //     },
  //     longitude: {
  //       gte: parseFloat(longitude) - lonRadius,
  //       lte: parseFloat(longitude) + lonRadius,
  //     },
  //   });
  // }

  console.log("Constructed Query:", JSON.stringify(query, null, 2));

  const properties = await prisma.property.findMany(query);
  console.log("Found Properties:", properties.length);

  return properties;
};

// export const searchProperties = async (filters) => {
//   const { minPrice, maxPrice, houseType, address, rooms, baths } = filters;

//   const priceFilter = {};
//   if (minPrice) priceFilter.gte = Number(minPrice);
//   if (maxPrice) priceFilter.lte = Number(maxPrice);

//   const searchCriteria = {
//     AND: [
//       priceFilter.gte || priceFilter.lte ? { price: priceFilter } : {},
//       houseType
//         ? { houseType: { contains: houseType, mode: "insensitive" } }
//         : {},
//       address ? { address: { contains: address, mode: "insensitive" } } : {},
//       rooms ? { rooms: Number(rooms) } : {},
//       baths ? { baths: Number(baths) } : {},
//     ],
//   };

//   try {
//     const properties = await prisma.property.findMany({
//       where: searchCriteria,
//     });

//     return properties;
//   } catch (error) {
//     console.error("Error searching properties:", error.message);
//     throw error;
//   }
// };
