import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';
import {User, USER_TYPE} from '../model';
import {catchError, map} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {throwError} from 'rxjs';

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
    canShowStats: boolean;

    isCustomer: boolean;
    private root: string;

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private userService: UserService,
                private policy: PolicyService) {
    }

    ngOnInit(): void {
        const paths = this.router.url.split('/');
        const id = +paths[3].split('?')[0];
        this.root = paths[1];
        if (!!id) {
            this.userService.findUserById(id).subscribe(data => {
                this.user = data;
                this.getPolicy();
            }, err => { throw err; });
        }
    }

    private getPolicy() {
        const entity = USER_TYPE[this.user.type];
        this.canSell = this.policy.get(entity, 'canSell');
        this.canMakeAppointments = this.policy.get(entity, 'canMakeAppointments');
        this.canShowBundles = this.policy.get(entity, 'canShow', 'bundles');
        this.canShowSales = this.policy.get(entity, 'canShow', 'sales');
        this.canShowStats = this.policy.get(entity, 'canShow', 'stats');
        this.isCustomer = entity === 'customer';
    }

    sell() {
        return this.router.navigate([this.root, 'sales', 'buy', this.user.id]);
    }

    makeAppointments() {
        return this.router.navigate([this.root, 'calendar', this.user.id]);
    }

    showBundles() {
        return this.router.navigate([this.root, 'customer', this.user.id, 'bundles']);
    }

    showSales() {
        return this.router.navigate([this.root, 'customer', this.user.id, 'sales']);
    }

    showStats() {
        return this.router.navigate([this.root, 'customer', this.user.id, 'stats']);
    }
}
