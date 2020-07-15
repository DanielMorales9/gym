import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';
import {User, USER_TYPE} from '../model';
import {BaseComponent} from '../base-component';
import {Policy} from '../policy.interface';

@Component({
    templateUrl: './user-controls.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserControlsComponent extends BaseComponent implements Policy,  OnInit {

    user: User;
    canSell: boolean;
    canShowBundles: boolean;
    canShowSales: boolean;
    canMakeAppointments: boolean;
    canShowSessions: boolean;
    canShowStats: boolean;

    isCustomer: boolean;
    private root: string;

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private userService: UserService,
                private cdr: ChangeDetectorRef,
                private policy: PolicyService) {
        super();
    }

    ngOnInit(): void {
        const paths = this.router.url.split('/');
        const id = +paths[3].split('?')[0];
        this.root = paths[1];
        if (!!id) {
            this.userService.findUserById(id).subscribe(data => {
                this.user = data;
                this.getPolicies();
                this.cdr.detectChanges();
            }, err => { throw err; });
        }
    }

    getPolicies() {
        const entity = USER_TYPE[this.user.type];
        this.isCustomer = entity === 'customer';
        this.canSell = this.policy.get(entity, 'canSell');
        this.canMakeAppointments = this.policy.get(entity, 'canMakeAppointments');
        this.canShowBundles = this.policy.get(entity, 'canShow', 'bundles');
        this.canShowSales = this.policy.get(entity, 'canShow', 'sales');
        this.canShowStats = this.policy.get(entity, 'canShow', 'stats');
        this.canShowSessions = this.policy.get(entity, 'canShow', 'sessions');
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

    showSessions() {
        return this.router.navigate([this.root, 'customer', this.user.id, 'sessions']);
    }
}
