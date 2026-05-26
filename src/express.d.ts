import { Role } from "./shared/utils/types";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: ;
        }

        interface Request {
            user?: User;
        }
    }
}
