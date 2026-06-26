import type { JwtPayload } from "../types/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}