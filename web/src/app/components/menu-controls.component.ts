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

    constructor(private auth: AuthenticationService,
                private cdr: ChangeDetectorRef,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.getRoles();
    }

    private getRoles() {
        this.auth.getRoles()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe( v => {
                this.roles = v.map(d => new Role(d.id, RoleNames[d.name]));
                this.currentRoleId = this.auth.getCurrentUserRoleId();
                this.cdr.detectChanges();
            });
    }

    doLogout() {
        this.logout.emit();
    }

    goToProfile() {
        this.router.navigateByUrl(this.auth.getUserRoleName() + '/profile');
    }

    goToGym() {
        this.router.navigateByUrl(this.auth.getUserRoleName() + '/settings/gym');
    }

    gotToStats() {
        this.router.navigateByUrl(this.auth.getUserRoleName() + '/stats');
    }

    switchRole(id: number) {
        this.auth.setCurrentUserRole(id);
        this.router.navigateByUrl(this.auth.getUserRoleName());
    }
}
