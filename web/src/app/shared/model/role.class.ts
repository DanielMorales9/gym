export enum USER_TYPE {
    A= 'admin',
    T = 'trainer',
    C = 'customer'
}

export let USER_INDEX = {
    1: 'admin',
    2: 'trainer',
    3: 'customer'
};

export class Role {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
