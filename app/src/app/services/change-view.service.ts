import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable({
        providedIn: "root"
})
export class ChangeViewService {
    private subject = new Subject<any>();

    id = Math.floor(Math.random() * 6) + 1;

    sendView(message: any) {
        this.subject.next(message);
    }

    getView(): Observable<any> {
        return this.subject.asObservable();
    }
}