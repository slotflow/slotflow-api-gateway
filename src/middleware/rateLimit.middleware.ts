import { Redis } from "@upstash/redis";
import { log } from "../shared/logger/logger";
import { Ratelimit } from "@upstash/ratelimit";
import { ERROR_CODES } from "../shared/utils/types";
import type { Request, Response, NextFunction } from "express";

const redis = Redis.fromEnv();

type AuthenticatedRequest = Request & {
  user?: {
    userId?: string;
  };
};

/**
 * Identifies an authenticated user when available.
 * Otherwise, falls back to the client's IP address.
 */
function getIdentifier(req: Request): string {
  const request = req as AuthenticatedRequest;
  const userId = request.user?.userId;

  return userId ? `user:${userId}` : `ip:${req.ip}`;
}

/**
 * Reuable express rate limit middleware.
 *
 * @param limit Maximum number of requests allowed
 * @param window Time period for the limit
 * @param prefix Namespace for this limiters Redis keys
 *  */
export function createRateLimit(options: {
  limit: number;
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`;
  prefix: string;
}) {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.limit, options.window),
    prefix: options.prefix,
    analytics: true,
  });

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = getIdentifier(req);
      const result = await limiter.limit(identifier);

      res.setHeader("RateLimit-Limit", result.limit);
      res.setHeader("RateLimit-Remaining", result.remaining);
      res.setHeader("RateLimit-Reset", Math.ceil(result.reset / 1000));

      if (!result.success) {
        res.setHeader("Retry-After", Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)));

        res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
          errorCode: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        });
        return;
      }

      next();
    } catch (error) {
      log.error("[RateLimit] Redis check failed", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });

      res.status(503).json({
        success: false,
        message: "Request protection is temporarily unavailable.",
        errorCode: "RATE_LIMIT_UNAVAILABLE",
      });
    }
  };
}

/**
 * General protection for API requests.
 * 100 requests per identifier in a one-minute sliding window.
 *  */
export const globalRateLimit = createRateLimit({
  limit: 100,
  window: "1 m",
  prefix: "slotflow:gateway:global",
});

// Stricter protection for login, OTP and password-reset endpoints.
export const authRateLimit = createRateLimit({
  limit: 10,
  window: "1 m",
  prefix: "slotflow:gateway:auth",
});

// Example limit for expensive search requests.
export const searchRateLimit = createRateLimit({
  limit: 30,
  window: "1 m",
  prefix: "slotflow:gateway:search",
});
