import {Component, OnInit} from '@angular/core';
import {Sale} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {SaleHelperService} from '../../services/sale-helper.service';
import {QueryableDatasource, SalesService} from '../../services';
import {SnackBarService} from '../../../services';
import {AuthenticationService} from '../../../core/authentication';


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class SalesComponent implements OnInit {

    private SIMPLE_NO_CARD_MESSAGE = 'Nessuna vendita disponibile';

    query: any;
    noCardMessage: string;

    private pageSize = 10;
    private queryParams: any;
    private id: number;

    ds: QueryableDatasource<Sale>;
    canPay: boolean;
    canDelete: boolean;
    mixed: boolean;

    constructor(private helper: SaleHelperService,
                private service: SalesService,
                private auth: AuthenticationService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private snackbar: SnackBarService) {
        this.noCardMessage = this.SIMPLE_NO_CARD_MESSAGE;
        this.ds = new QueryableDatasource<Sale>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        const path = this.activatedRoute.parent.parent.snapshot.routeConfig.path;
        switch (path) {
            case 'admin':
                this.mixed = this.canDelete = this.canPay = true;
                break;
            case 'customer':
                this.mixed = this.canDelete = this.canPay = false;
                this.id = this.auth.getUser().user.id;
                break;
        }
        this.initQueryParams(this.id);
    }

    private initQueryParams(id?) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.queryParams = Object.assign({}, params);
            if (Object.keys(params).length > 0) {
                if (!!this.queryParams.date) {
                    this.queryParams.date = new Date(this.queryParams.date);
                }
            }
            if (id) {
                this.queryParams.id = id;
            }
            this.search(this.queryParams);
        });
    }

    private updateQueryParams(event?) {
        if (!event) { event = {}; }
        if (this.id) { event.id = this.id; }

        this.queryParams = this.query = event;
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
            });
    }

    search($event?) {
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteSale($event.sale);
                break;
            case 'pay':
                this.paySale($event.sale, $event.amount);
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
                    return this.search();
                }, err => this.snackbar.open(err.error.message));
        }
    }

    private paySale(sale: Sale, amount: number) {
        this.service.pay(sale.id, amount)
            .subscribe(_ => this.search());
    }
}
