import { Role, TimeZone } from "./shared/utils/types";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: Role;
      email: string;
      name: string;
      timeZone: TimeZone;
    }

    interface Request {
      user?: User;
    }
  }
}
