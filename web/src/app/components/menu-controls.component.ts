import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../core/authentication';

@Component({
    selector: 'menu',
    templateUrl: './menu-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
})
export class MenuControlsComponent {

    @Input() hideLogin;
    @Input() hideMenu;
    @Output() logout = new EventEmitter();

    constructor(private auth: AuthenticationService,
                private router: Router) {}

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
        return this.auth.getUserRole() % 2 === 1;
    }
}
