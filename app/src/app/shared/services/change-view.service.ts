import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChangeViewService {
    private subject = new Subject<any>();

    sendView(message: any) {
        this.subject.next(message);
    }

    getView(): Observable<any> {
        return this.subject.asObservable();
    }
}