import {Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
    selector: 'side-nav',
    templateUrl: './side-bar.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
})
export class SideBarComponent {

    @Input() id: number;
    @Input() current_role_view: number;
    @Input() opened: boolean;
    @Input() mode: string;
    @Input() appName: string;
    @Input() isMobile: boolean;

    @ViewChild('sideNav', { static: true })
    public sideNav: MatSidenav;

    constructor(private router: Router,
                private route: ActivatedRoute) {}

    isOnCalendar() {
        return this.router.url.includes('calendar');
    }

    async goToView(view?) {
        const params = Object.assign({}, this.route.snapshot.queryParams);
        if (!!view) {
            params['view'] = view;
        }
        else {
            params['viewDate'] = new Date();
        }
        const url = this.router.url.split('?')[0];
        await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
        });
    }

    async toggle(b?: boolean) {
        await this.sideNav.toggle(b);
    }

    async close() {
        await this.sideNav.close();
    }
}
