import {Bundle} from './bundle.class';

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
        this.id = id;
        this.name = name;
        this.number = number;
        this.price = price;
        this.createdAt = createdAt;
        this.type = type;
    }

    progress(bundle: Bundle): number {
        if (!!bundle.startTime && !!bundle.endTime) {
            const start = new Date(bundle.startTime).getTime();
            const end = new Date(bundle.endTime).getTime();
            const now = new Date().getTime();
            if (now >= end) { return 1; }
            else { return  Math.floor((now - start) / (end - start)); }
        }
        else {
            return 0;
        }
    }


}

export class OnDemandPurchaseOption extends Option {
}

export class TimePurchaseOption extends Option {
}

export class BundlePurchaseOption extends Option {
    progress(bundle: Bundle): number {
        let numSessions = 0;
        if (bundle.sessions !== undefined) {
            numSessions = bundle.sessions.length;
        }
        return numSessions / this.number;
    }
}

export enum OptionType {
    B = 'Pacchetto',
    T = 'A Tempo',
    D = 'A Consumo'
}
