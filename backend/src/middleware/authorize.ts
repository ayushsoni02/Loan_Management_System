import { Request, Response, NextFunction } from "express";
import { Role, ROLES } from "../constants/roles";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const hasAccess = allowedRoles.includes(req.user.role) || req.user.role === ROLES.ADMIN;

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: "Forbidden: Insufficient privileges" });
    }

    next();
  };
};
