import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
 
@Injectable()
export class AuthenticatedService {
    private subject = new Subject<any>();
 
    setAuthenticated(message: any) {
        this.subject.next(message);
    }
 
    getAuthenticated(): Observable<any> {
        return this.subject.asObservable();
    }
}