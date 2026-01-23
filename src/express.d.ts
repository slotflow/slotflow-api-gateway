import { Role } from "./shared/utils/types";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: Role;
        }

        interface Request {
            user?: User;
        }
    }
}
