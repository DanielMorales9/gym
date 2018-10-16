export interface Bundle {
    id: number,
    name: string; // required, must be valid email format
    price: number; // required, value must be equal to confirm password.
    numSessions: number; // required, value must be equal to password.
    description: string;
    disabled: boolean;
    type: string;
}