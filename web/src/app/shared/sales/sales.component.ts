import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Sale} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesService} from '../../core/controllers';
import {AuthenticationService} from '../../core/authentication';
import {SnackBarService} from '../../core/utilities';
import {QueryableDatasource, SaleHelperService} from '../../core/helpers';
import {PolicyService} from '../../core/policy';
import {first, takeUntil} from 'rxjs/operators';
import {SearchComponent} from '../search-component';
import {GetPolicies} from '../policy.interface';


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesComponent extends SearchComponent<Sale> implements GetPolicies, OnInit {

    private SIMPLE_NO_CARD_MESSAGE = 'Nessuna vendita disponibile';

    query: any;
    noCardMessage: string;

    id: number;

    canPay: boolean;
    canDelete: boolean;
    canSell: boolean;

    mixed: boolean;
    filters = [
        {name: 'Da Pagare', value: false},
        {name: 'Pagati', value: true},
        {name: 'Entrambi', value: undefined}];
    filterName = 'payed';
    selected = undefined;
    private root: string;

    constructor(private helper: SaleHelperService,
                private service: SalesService,
                private auth: AuthenticationService,
                protected router: Router,
                protected route: ActivatedRoute,
                private policy: PolicyService,
                private snackbar: SnackBarService) {
        super(router, route);
        this.noCardMessage = this.SIMPLE_NO_CARD_MESSAGE;
        this.ds = new QueryableDatasource<Sale>(helper, this.query);
    }

    ngOnInit(): void {
        this.root = this.route.parent.parent.snapshot.routeConfig.path;
        this.getPolicies();

        this.route.params
            .pipe(first(),
                takeUntil(this.unsubscribe$))
            .subscribe(params => {
                this.id = +params['id'];
                this.initQueryParams();
            });
    }

    getPolicies() {
        this.canDelete = this.policy.get('sale', 'canDelete');
        this.canPay = this.policy.get('sale', 'canPay');
        this.canSell = this.policy.get('sale', 'canSell') && !!this.id;
    }

    protected initDefaultQueryParams(params: any): any {
        if (Object.keys(params).length > 0) {
            if (!!params.date) {
                params.date = new Date(params.date);
            }
        }

        if (!!this.id) {
            params.id = this.id;
        }
        this.mixed = this.canDelete && !this.id;
        return params;
    }

    protected enrichQueryParams($event?): any {
        if (this.id) { $event.id = this.id; }
        return $event;
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteSale($event.sale);
                break;
            case 'pay':
                this.paySale($event.sale, $event.amount);
                break;
            case 'info':
                this.goToDetails($event.sale);
                break;
            case 'userInfo':
                this.goToUserDetails($event.user);
                break;
        }
    }

    private deleteSale(sale: Sale) {
        const confirmed = confirm('Vuoi confermare l\'eliminazione della vendita per il cliente ' +
            sale.customer.firstName + ' ' + sale.customer.lastName + '?');
        if (confirmed) {
            this.helper.delete(sale.id)
                .subscribe( _ => {
                    this.snackbar.open('Vendita eliminata per il cliente ' + sale.customer.lastName + '!');
                    return this.dataSourceSearch(this.queryParams);
                }, err => this.snackbar.open(err.error.message));
        }
    }

    private paySale(sale: Sale, amount: number) {
        this.service.pay(sale.id, amount)
            .subscribe(_ => this.dataSourceSearch(this.queryParams));
    }

    private goToDetails(sale: Sale) {
        const roleName = this.auth.getUserRoleName();
        this.router.navigate([roleName, 'sales', sale.id]);
    }

    sell() {
        return this.router.navigate([this.root, 'sales', 'buy', this.id]);
    }

    trackBy(index, item) {
        return item ? item.id : index;
    }

    private goToUserDetails(user: any) {
        const roleName = this.auth.getUserRoleName();
        this.router.navigate([roleName, 'users', user.id]);
    }
}
