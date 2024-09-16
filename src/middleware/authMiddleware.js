import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import { prisma } from "../../app.js";
import { isBlacklisted } from "../services/blacklistService.js";
// import { UnauthorizedException } from "../exception/unauthorized.js";
// import { ErrorCodes } from "../exception/root.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(409).json("Unauthorized");
  }
  if (isBlacklisted(token)) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(409).json("Unauthorized");
    }
    req.user = user;

    next();
  } catch (err) {
    err;
  }
};

export const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
