import {
  calculateOverdueAndUnpaid,
  getRentUsageForTenant,
} from "./rentServices.js";

export const getTenantRentUsage = async (req, res, next) => {
  try {
    const tenantId = req.user.id; // Extracting tenantId from the authenticated user

    const rentUsage = await getRentUsageForTenant(tenantId);
    res.status(200).json(rentUsage);
  } catch (error) {
    console.error("Error fetching rent usage:", error.message);
    next(error);
  }
};

export const OverdueAndUnpaid = async (req, res, next) => {
  try {
    const landlordId = req.user.id;
    console.log(landlordId);
    const result = await calculateOverdueAndUnpaid(landlordId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
