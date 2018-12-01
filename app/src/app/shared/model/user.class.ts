import {Role} from "./role.class";

export class User {
    id: number;
    email: string; // required, must be valid email format
    password: string; // required, value must be equal to confirm password.
    confirmPassword: string; // required, value must be equal to password.
    firstName: string;
    lastName: string;
    type: string;
    createdAt: string;
    verified: boolean;
    height: number;
    weight: number;
    defaultRoles: number[];
    roles: Role[];

    constructor() {
        this.roles = [];
    }

}