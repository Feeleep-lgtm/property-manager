import { Router } from "express";
import authRoutes from "./auth.js";
import propertyRouter from "./property.js";
import landlordRoute from "./landlord.js";
import tenantRoutes from "./tenant.js";
import userRoute from "./user.js";
import agentRoute from "./agent.js";
import paymentRouter from "./payment.js";
import rentalRoute from "./rental.js";
import bookmarkRoute from "./bookmark.js";
import { loadSkeleton } from "../Modules/skeleton.js";

import bvnRoute from "./bvnRoutes.js";
import complainRoute from "./complain.js";

const appRoute = Router();

appRoute.use("/auth", authRoutes);
//appRoute.use("auth", propertyRouter);
appRoute.use("/property", propertyRouter);
appRoute.use("/landlord", landlordRoute);
appRoute.use("/tenant", tenantRoutes);
appRoute.use("/users", userRoute);
appRoute.use("/agent", agentRoute);
appRoute.use("/payment", paymentRouter);
appRoute.use("/rent-property", rentalRoute);
appRoute.use("/bookmark", bookmarkRoute);
appRoute.use("/skeleton", loadSkeleton);
appRoute.use("/messages", bvnRoute);
appRoute.use("/complain", complainRoute);

export default appRoute;
