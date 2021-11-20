export enum USER_TYPE {
    A = 'admin',
    T = 'trainer',
    C = 'customer'
}

export let TypeIndex = {
    'A': 1,
    'T': 2,
    'C': 3
};

export let RoleIndex = {
    'ADMIN': 1,
    'TRAINER': 2,
    'CUSTOMER': 3
};

export let TypeNames = {
    'A': 'Amministratore',
    'T': 'Allenatore',
    'C': 'Cliente',
};

export let UserIndex = {
    1: 'admin',
    2: 'trainer',
    3: 'customer'
};

export let Roles = [
    'admin',
    'trainer',
    'customer'
];

export let RoleNames = {
    'ADMIN': 'Amministratore',
    'TRAINER': 'Allenatore',
    'CUSTOMER': 'Cliente'
};



export class Role {
    id: number;
    name: string;

    constructor(name: string) {
        this.id = RoleIndex[name];
        this.name = name;
    }
}
