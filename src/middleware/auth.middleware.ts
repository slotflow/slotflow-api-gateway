import { jwtConfig } from "../config/env";
import { log } from "../shared/logger/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ERROR_CODES, Role } from "../shared/utils/types";
import { Request, Response, NextFunction } from "express";
import { AppError, UnauthorizedError } from "../shared/error/appError";

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
    return next(new UnauthorizedError());
  };

  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);

    if (typeof decoded === "string") {
      log.error(`Invalid token: ${token}`);
      return next(new UnauthorizedError());
    };

    const payload = decoded as AccessTokenPayload;

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      log.error(`Token expired: ${token}`);
      return next(new UnauthorizedError());
    };

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    log.error("Error in authMiddleware", error as Error);
    next(new AppError(
      "Internal server error",
      500,
      false,
      ERROR_CODES.INTERNAL_ERROR
    ))
  };
};
