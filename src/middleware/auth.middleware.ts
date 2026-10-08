import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/env";
import { log } from "../shared/logger/logger";
import { AccessTokenPayload, AuthUser, ERROR_CODES } from "../shared/utils/types";
import { Request, Response, NextFunction } from "express";
import { AppError, UnauthorizedError } from "../shared/error/appError";
import { ServerResponse } from "http";
import { Socket } from "net";

const parseCookies = (cookieHeader?: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (name) {
      cookies[name.trim()] = rest.join("=").trim();
    }
  });

  return cookies;
};

export const authMiddleware = (
  req: Request,
  res: Response | ServerResponse | Socket,
  next: NextFunction
) => {
  let token: string | undefined = req.cookies?.token;

  // 1. Fallback: Parse raw Cookie header if req.cookies is undefined (e.g. during WS Upgrade)
  if (!token && req.headers.cookie) {
    const parsedCookies = parseCookies(req.headers.cookie);
    token = parsedCookies["token"];
  }

  // 2. Fallback: Check Authorization header ("Bearer <token>")
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. Fallback: Check query params (e.g., ?token=... or ?EIO=4&token=...)
  if (!token && req.query?.token) {
    token = req.query.token as string;
  }

  if (!token) {
    log.error(
      `No token found in request. Path: ${req.url || req.path}, rawCookieHeader: ${!!req.headers.cookie}`
    );
    return next(new UnauthorizedError());
  }

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
      name: payload.name,
      email: payload.email,
      timeZone: payload.timeZone
    } as AuthUser;

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
