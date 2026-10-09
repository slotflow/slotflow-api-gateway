import { AuthUser } from "./types";
import { ClientRequest } from "node:http";

export const attachHeaders = (proxyReq: ClientRequest, user: AuthUser) => {
  if (user.id) {
    proxyReq.setHeader("x-user-id", encodeURIComponent(String(user.id)));
  }

  if (user.role) {
    proxyReq.setHeader("x-user-role", encodeURIComponent(String(user.role)));
  }

  if (user.name) {
    proxyReq.setHeader("x-user-name", encodeURIComponent(user.name));
  }

  if (user.email) {
    proxyReq.setHeader("x-user-email", encodeURIComponent(user.email));
  }

  if (user.timeZone) {
    const timeZoneStr = JSON.stringify(user.timeZone);
    proxyReq.setHeader("x-user-timezone", encodeURIComponent(timeZoneStr));
  }
};
