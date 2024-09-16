import cron from "node-cron";
import { updateRentPercentageForAllTenants } from "./services/propertyService.mjs";

// Schedule the job to run daily at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    await updateRentPercentageForAllTenants();
    console.log("Rent percentages updated successfully");
  } catch (error) {
    console.error("Error updating rent percentages", error);
  }
});
