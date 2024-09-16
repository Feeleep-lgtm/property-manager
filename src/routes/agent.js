import { Router } from "express";
import * as agentController from "../Modules/Agent/agentController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
const agentRoute = Router();

agentRoute.get(
  "/",
  [authMiddleware],
  authorize("ADMIN", "AGENT"),
  agentController.getAllAgents
);

agentRoute.get(
  "/:id",
  [authMiddleware],
  authorize("ADMIN", "AGENT"),
  agentController.getOneAgent
);

agentRoute.get(
  "/:id/properties",
  [authMiddleware],
  authorize("ADMIN", "AGENT"),
  agentController.getAllAgentProperties
);

agentRoute.get(
  "/:id/properties/:propertyId",
  [authMiddleware],
  authorize("ADMIN", "AGENT"),
  agentController.getOneAgentProperty
);

export default agentRoute;
