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
        this.auth.getRoles()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe( v => {
                this.roles = v;
                console.log(v, this.roles, this.currentRoleId);
                this.setCurrentRole(this.currentRoleId || this.roles[0].id);
            });

        this.auth.getObservableCurrentUserRoleId()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe( v => {
                this.setCurrentRole(v);
            });
    }

    setCurrentRole(v) {
        if (this.currentRoleId !== v) {
            this.currentRoleId = v;
            this.roleName = this.auth.getUserRoleName(this.currentRoleId);
            this.router.navigateByUrl(this.roleName);
            this.cdr.detectChanges();
        }
        console.log(this.currentRoleId);
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
