import { jwtConfig } from "../config/env";
import { Role } from "../shared/utils/types";
import { log } from "../shared/logger/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role: Role;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.cookies?.token;

  if (!token) {
    log.error(`No token found in request. Path: ${req.path}, hasCookies: ${!!req.cookies}, cookieNames: ${req.cookies ? Object.keys(req.cookies).join(",") : "none"}`);
    return res.status(401).json({ message: "Unauthorized" });
  };

  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    };

    const payload = decoded as AccessTokenPayload;

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Token expired" });
    };

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    log.error("Error in authMiddleware", error as Error);
    return res.status(401).json({ message: "Invalid token" });
  };
};
