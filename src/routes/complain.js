import { Router } from "express";
import { submitComplaint } from "../Modules/complain/service.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const complainRoute = Router();

complainRoute.post("/", [authMiddleware], submitComplaint);

export default complainRoute;
