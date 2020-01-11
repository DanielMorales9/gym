import {User} from './user.class';
import {SaleLineItem} from './sale_line_item.class';

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

    constructor() {}
}
