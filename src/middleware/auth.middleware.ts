import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface GatewayRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface AccessTokenPayload extends JwtPayload {
  userOrProviderId: string;
  role: string;
}

export const authMiddleware = (
  req: GatewayRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PUBLIC_KEY as jwt.Secret
    );

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const payload = decoded as AccessTokenPayload;

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = {
      id: payload.userOrProviderId,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
