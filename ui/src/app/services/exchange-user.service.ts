import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
 
@Injectable()
export class ExchangeUserService {
    private subject = new Subject<any>();
 
    sendUser(message: any) {
        this.subject.next(message);
    }
 
    getUser(): Observable<any> {
        return this.subject.asObservable();
    }
}