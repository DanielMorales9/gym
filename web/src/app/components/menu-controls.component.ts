import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../core';
import {Role} from '../shared/model';
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

    roles: Role[];
    currentRoleId: number;

    constructor(private auth: AuthenticationService,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.auth.getObservableUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => {
            this.roles = user.roles;
            this.currentRoleId = this.auth.getCurrentUserRoleId();
            this.cdr.detectChanges();
        })
    }

    switchRole(id: number) {
        if (this.currentRoleId !== id) {
            this.currentRoleId = id;
            this.auth.setCurrentUserRoleId(id);
            this.cdr.detectChanges();
            this.auth.navigateByRole()
        }
    }

    doLogout() {
        this.currentRoleId = undefined;
        this.roles = undefined;
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
