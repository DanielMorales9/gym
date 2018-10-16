import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
 
@Injectable()
export class ExchangeSaleService {
    private subject = new Subject<any>();
 
    sendSale(message: any) {
        this.subject.next(message);
    }
 
    getSale(): Observable<any> {
        return this.subject.asObservable();
    }
}