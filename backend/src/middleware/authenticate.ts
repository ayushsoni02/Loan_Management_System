import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../constants/roles";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: Role };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
