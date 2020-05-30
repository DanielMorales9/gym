import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../core/authentication';

@Component({
    selector: 'menu',
    templateUrl: './menu-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuControlsComponent {

    @Input() hideLogin;
    @Input() hideMenu;
    @Output() logout = new EventEmitter();


    constructor(private auth: AuthenticationService,
                private router: Router) {
    }

    getRoles() {
        return this.auth.getRoles().sort(a => a.id);
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

    showStats() {
        return this.auth.getCurrentUserRole() % 2 === 1;
    }

    switchRole(id: number) {
        this.auth.setCurrentUserRole(id);
        this.router.navigateByUrl(this.auth.getUserRoleName());
    }

    showRole(number: number) {
        return this.getRoles().filter(r => r.id === number).length === 1;
    }

    showRoles() {
        return this.getRoles().length > 1;
    }

    isCurrentRole(number: number) {
        return this.auth.getCurrentUserRole() === number;
    }
}
