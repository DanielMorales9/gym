import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../core/authentication';
import {Role, RoleNames} from '../shared/model';
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
    roleName: string;

    constructor(private auth: AuthenticationService,
                private cdr: ChangeDetectorRef,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.getRoles();
    }

    getRoles() {
        this.auth.getObservableRoles()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe( v => {
                this.roles = v;
                this.setCurrentRole(this.currentRoleId || this.roles[0].id);
            });

        this.auth.getObservableCurrentUserRoleId()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe( v => {
                this.setCurrentRole(v);
            });

        setTimeout(() => {
            if (this.auth.isAuthenticated()) {
                this.roles = this.auth.getUser().roles;
                this.setCurrentRole(this.currentRoleId || this.roles[0].id);
            }
        }, 1000);
    }

    setCurrentRole(v) {
        if (this.currentRoleId !== v) {
            this.currentRoleId = v;
            this.roleName = this.auth.getUserRoleName(this.currentRoleId);
            this.router.navigateByUrl(this.roleName);
            this.cdr.detectChanges();
        }
    }

    doLogout() {
        this.currentRoleId = undefined;
        this.roles = undefined;
        this.roleName = undefined;
        this.logout.emit();
    }

    goToProfile() {
        this.router.navigateByUrl(this.roleName + '/profile');
    }

    goToGym() {
        this.router.navigateByUrl(this.roleName + '/settings/gym');
    }

    gotToStats() {
        this.router.navigateByUrl(this.roleName + '/stats');
    }

    switchRole(id: number) {
        this.auth.setCurrentUserRole(id);
    }
}
