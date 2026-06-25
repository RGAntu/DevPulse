import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import { sendError } from "../utils/sendResponse";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: "contributor" | "maintainer";
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers["authorization"];

  if (!token) {
    sendError(res, StatusCodes.UNAUTHORIZED, "Access denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, config.secret as string) as {
      id: number;
      name: string;
      role: "contributor" | "maintainer";
    };

    req.user = decoded;
    next();
  } catch {
    sendError(res, StatusCodes.UNAUTHORIZED, "Invalid or expired token.");
  }
};

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, StatusCodes.FORBIDDEN, "You do not have permission.");
      return;
    }
    next();
  };
};