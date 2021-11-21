import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthenticationDirective} from '../core/authentication';
import {User} from '../shared/model';
import {BaseComponent} from '../shared/base-component';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './primary-customer-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryCustomerControlsComponent extends BaseComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationDirective,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.auth.getObservableUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
                if (!this.user) {
                    this.user = v;
                    this.cdr.detectChanges();
                }
            });
    }


}
