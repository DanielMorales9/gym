import {User} from '../../shared/model';
import {AuthenticationService} from '../../core';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/base-component';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationService,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.auth.getObservableUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
                if (!this.user) {
                    this.user = v;
                    this.cdr.detectChanges();
                }
            });

        // TODO fix sync problem
        setTimeout(() => {
            this.user = this.auth.getUser();
            this.cdr.detectChanges();
        }, 300);
    }
}