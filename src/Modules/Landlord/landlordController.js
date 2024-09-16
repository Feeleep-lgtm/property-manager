import * as landlordController from "./landlordServices.js";
import { prisma } from "../../../app.js";

import { getLandlordDashboardData } from "./landlordServices.js";

export const getAllLandlords = async (req, res) => {
  try {
    const landlords = await landlordController.getAllLandlords();
    res.status(200).json(landlords);
  } catch (error) {
    console.error("Error fetching landlords:", error);
    res
      .status(500)
      .json({ message: "Error fetching landlords", error: error.message });
  }
};

export const getLandlordProperties = async (req, res) => {
  try {
    const landlordId = req.user.id; // Assuming req.user.id contains the authenticated landlord's ID
    const properties = await landlordController.getLandlordProperties(
      landlordId
    );

    if (!properties.length) {
      return res
        .status(404)
        .json({ message: "No properties found for this landlord" });
    }
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLandlordById = async (req, res) => {
  const { id } = req.params;
  try {
    const landlord = await landlordController.getLandlordById(id);
    res.status(200).json(landlord);
  } catch (error) {
    console.error("Error fetching landlord:", error);
    res
      .status(500)
      .json({ message: "Error fetching landlord", error: error.message });
  }
};

export const getLandlordProperty = async (req, res) => {
  try {
    const landlordId = req.user.id; // Assuming req.user.id contains the authenticated landlord's ID
    const propertyId = req.params.id;
    const property = await landlordController.getLandlordPropertyById(
      propertyId,
      landlordId
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found or you do not have permission to view it",
      });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLandlordTenants = async (req, res, next) => {
  try {
    const landlordId = req.user.id;

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

    const tenants = properties.flatMap((property) =>
      property.rentals.map((rental) => rental.tenant)
    );

    res.status(200).json(tenants);
  } catch (error) {
    console.error("Error retrieving tenants:", error);
    res.status(500).json({ message: "Error retrieving tenants" });
  }
};

export const getTenantsForProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        rentals: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const tenants = property.rentals.map((rental) => rental.tenant);

    res.status(200).json(tenants);
  } catch (error) {
    console.error("Error retrieving tenants for property:", error);
    res.status(500).json({ message: "Error retrieving tenants for property" });
  }
};

export const getLandlordDashboard = async (req, res) => {
  const landlordId = req.user.id;
  const filter = req.query.filter;

  try {
    const dashboardData = await landlordController.getLandlordDashboardData(
      landlordId,
      filter
    );
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOverdueAndAlmostDueTenants = async (req, res) => {
  try {
    const landlordId = req.user.id;
    const tenants = await landlordController.fetchOverdueAndAlmostDueTenants(
      landlordId
    );

    if (tenants.length === 0) {
      return res.status(200).json({ message: "No tenants" });
    }

    return res.status(200).json(tenants);
  } catch (error) {
    console.error(
      "Error fetching overdue and almost due tenants:",
      error.message
    );
    return res.status(500).json({ message: "Error fetching tenants" });
  }
};
