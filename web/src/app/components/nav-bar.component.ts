import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector: 'nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {

    @Input() authenticated: boolean;
    @Input() appName: string;
    @Input() title: string[];
    @Input() isMobile: boolean;
    @Input() isBack: boolean;

    @Output() logout = new EventEmitter();
    @Output() home = new EventEmitter();
    @Output() snav = new EventEmitter();


    constructor(private router: Router,
                private location: Location) {}


    openSideBar() {
        this.snav.emit();
    }
    doLogout() {
        this.logout.emit();
    }

    hideLogin() {
        return this.authenticated || (!this.router.url.startsWith('/auth/home') && this.router.url.startsWith('/auth') );
    }

    goHome() {
        this.home.emit();
    }

    back() {
        this.location.back();
    }
}
