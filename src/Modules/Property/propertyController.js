import * as propertyService from "./propertyServices.js";

//import { prisma } from "../../../app.js";
import { uploadFile } from "../../utils/utils.s3.js";
import { prisma } from "../../../app.js";
//import { uploadToS3 } from "../../Configurations/s3.js";

export const addProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    const ownerId = req.user.id;

    console.log("Property data received:", propertyData);
    console.log("Owner ID:", ownerId);
    console.log("Files:", req.files);

    if (propertyData.additionalCharges) {
      propertyData.additionalCharges = JSON.parse(
        propertyData.additionalCharges
      );
    }

    const property = await propertyService.createProperty(
      propertyData,
      ownerId
    );
    res.status(201).json(property);
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Error adding property" });
  }
};

export const getReferralCode = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { referralCode: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({ referralCode: property.referralCode });
  } catch (error) {
    console.error("Error fetching referral code:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to get property with ID: ${id}`);

  try {
    const property = await propertyService.getPropertyById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Error getting property by ID:", error);
    res.status(404).json({ message: "No property for this landlord" });
  }
};

export const filter = async (req, res, next) => {
  try {
    const filters = req.query;
    console.log("Received Filters:", filters);

    const properties = await propertyService.searchProperties(filters);

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found matching the search criteria" });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error in searchPropertiesController:", error);
    res.status(500).json({ message: "Error searching properties" });
  }
};
// export const searchProperties = async (req, res) => {
//   const filters = req.query;

//   try {
//     const properties = await propertyService.searchProperties(filters);
//     res.status(200).json(properties);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
