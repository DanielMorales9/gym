import {Role} from './role.class';

export class Image {
    name: string;
    pic_byte: any;
    type: string;
}

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
    roles: Role[];
    currentTrainingBundles: any;
    phoneNumber: string;
    image: Image;
    gender: boolean;

    constructor() {
        this.roles = [];
    }

}
