import {User} from './user.class';
import {SaleLineItem} from './saleLineItem.class';

export class Payment {
    id: number;
    amount: number;
    createdAt: string;
}

export class Sale {

    id: number;
    totalPrice: number;
    amountPayed: number;
    completed: boolean;
    createdAt: string;
    customer: User;
    deletable: boolean;
    payed: boolean;
    payedDate: string;
    salesLineItems: SaleLineItem[];
    payments: Payment[];

    constructor() {}
}
