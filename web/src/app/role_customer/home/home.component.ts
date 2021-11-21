import {User} from '../../shared/model';
import {AuthenticationDirective} from '../../core/authentication';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../shared/base-component';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationDirective,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.user = this.auth.getUser();
        this.onAuthenticate();
    }

    private onAuthenticate() {
        this.auth.onAuthenticate()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isAuthenticated => {
                if (isAuthenticated) {
                    this.user = this.auth.getUser();
                } else {
                    this.user = null;
                }
                this.cdr.detectChanges();
            });
    }
}
