import {User} from '../../shared/model';
import {AuthenticationDirective} from '../../core';
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
                this.cdr.detectChanges()
            });
    }
}
