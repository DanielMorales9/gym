import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';
import {User, USER_TYPE} from '../model';

@Component({
    templateUrl: './user-controls.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/app.component.css'],
})
export class UserControlsComponent implements OnInit {

    user: User;
    canSell: boolean;
    canShowBundles: boolean;
    canShowSales: boolean;
    canMakeAppointments: boolean;
    isCustomer: boolean;

    private root: string;

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private userService: UserService,
                private policy: PolicyService) {

        // this.root = this.route.parent.parent.snapshot.routeConfig.path;
    }

    async ngOnInit(): Promise<void> {
        const paths = this.router.url.split('/');
        const id = +paths[3].split('?')[0];
        this.root = paths[1];
        if (!!id) {
            const [data, error] = await this.userService.findById(id);
            if (error) {
                throw error;
            } else {
                this.user = data;
                const entity = USER_TYPE[this.user.type];
                this.canSell = this.policy.get(entity, 'canSell');
                this.canMakeAppointments = this.policy.get(entity, 'canMakeAppointments');
                this.canShowBundles = this.policy.get(entity, 'canShow', 'bundles');
                this.canShowSales = this.policy.get(entity, 'canShow', 'sales');
                this.isCustomer = entity === 'customer';
            }
        }
    }

    sell() {
        return this.router.navigate([this.root, 'sales', 'buy', this.user.id]);
    }

    makeAppointments() {
        return this.router.navigate([this.root, 'calendar', this.user.id]);
    }

    showBundles() {
        return this.router.navigate([this.root, 'customer', 'bundles'], {
            queryParams: { id: this.user.id }
        });
    }

    showSales() {
        return this.router.navigate([this.root, 'sales', this.user.id]);
    }
}
