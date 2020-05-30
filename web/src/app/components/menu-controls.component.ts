import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../core/authentication';
import {Role} from '../shared/model';
import {Observable, of} from 'rxjs';

@Component({
    selector: 'menu',
    templateUrl: './menu-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuControlsComponent implements OnInit {

    @Input() hideLogin;
    @Input() hideMenu;
    @Output() logout = new EventEmitter();
    roles: Role[];
    currentRoleId: number;


    constructor(private auth: AuthenticationService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.getRoles();
        this.getCurrentRoleId();
    }

    private getRoles() {
         this.roles = this.auth.getRoles().sort(a => a.id);
    }

    private getCurrentRoleId() {
        this.currentRoleId = this.auth.getCurrentUserRoleId();
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
