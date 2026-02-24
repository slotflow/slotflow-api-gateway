export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    PROVIDER = "PROVIDER",
};

export interface User {
    id: string;
    role: Role;
};