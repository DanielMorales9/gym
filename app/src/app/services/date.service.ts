import { Injectable } from '@angular/core'
import {SaleLineItem, Sale, Bundle, User} from "../shared/model";
import {SalesService} from "../shared/services";

@Injectable()
export class DateService {

    constructor() {}

    public getDate(d) {
        let currentdate = new Date(d);
        return currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();

    }
}