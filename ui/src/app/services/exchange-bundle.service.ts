import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
 
@Injectable()
export class ExchangeBundleService {
    private subject = new Subject<any>();
 
    sendBundle(message: any) {
        this.subject.next(message);
    }
 
    getBundle(): Observable<any> {
        return this.subject.asObservable();
    }
}