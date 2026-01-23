export enum Role {
    Admin = "ADMIN",
    User = "USER",
    Provider = "PROVIDER",
};

export interface User {
    id: string;
    role: Role;
};