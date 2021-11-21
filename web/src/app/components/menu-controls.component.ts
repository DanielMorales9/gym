import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {AuthenticationDirective} from '../core';
import {User} from '../shared/model';
import {BaseComponent} from '../shared/base-component';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'menu',
    templateUrl: './menu-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuControlsComponent extends BaseComponent implements OnInit {

    @Input() hideLogin;
    @Input() hideMenu;
    @Output() logout = new EventEmitter();

    user: User;
    currentRoleId: number;

    constructor(private auth: AuthenticationDirective,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        // this.user = this.auth.getUser();
        // this.currentRoleId = this.auth.getCurrentUserRoleId();
        this.onAuthenticate();
    }

    private onAuthenticate() {
        this.auth.onAuthenticate()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isAuthenticated => {
                if (isAuthenticated) {
                    this.user = this.auth.getUser();
                    this.currentRoleId = this.auth.getCurrentUserRoleId();
                } else {
                    this.user = undefined;
                    this.currentRoleId = undefined;
                }
                this.cdr.detectChanges()
            });
    }

    switchRole(id: number) {
        if (this.currentRoleId !== id) {
            this.currentRoleId = id;
            this.auth.setCurrentUserRoleId(id);
            this.cdr.detectChanges();
            this.auth.navigateByRole();
        }
    }

    doLogout() {
        this.currentRoleId = undefined;
        this.user = undefined;
        this.logout.emit();
    }

    goToAppInfo() {
        this.auth.navigateByRole('appInfo');
    }

    goToProfile() {
        this.auth.navigateByRole('profile');
    }

    goToGym() {
        this.auth.navigateByRole('settings', 'gym');
    }

    gotToStats() {
        this.auth.navigateByRole('stats');
    }


}
