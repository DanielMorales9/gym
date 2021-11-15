export class Option {
    id: number;
    name: string;
    number: number;
    price: number;
    createdAt: Date;
    type: string;

    constructor(id?: number,
                name?: string,
                number?: number,
                price?: number,
                createdAt?: Date,
                type?: string) {
        this.id = id
        this.name = name
        this.number = number
        this.price = price
        this.createdAt = createdAt
        this.type = type
    }

}

export class OnDemandPurchaseOption extends Option {
}

export class TimePurchaseOption extends Option {
}

export class BundlePurchaseOption extends Option {
}

export enum OptionType {
    B = 'Pacchetto',
    T = 'A Tempo',
    D = 'A Consumo'
}