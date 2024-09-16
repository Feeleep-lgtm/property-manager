import { Router } from "express";
import { verifyBVN } from "../Modules/bvnController.js";

const bvnRoute = Router();
bvnRoute.post("/verify-bvn", verifyBVN);

export default bvnRoute;
