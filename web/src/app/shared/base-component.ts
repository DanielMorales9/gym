import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

// TODO: Add Angular decorator.
export class BaseComponent implements OnDestroy {
    unsubscribe$ = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
