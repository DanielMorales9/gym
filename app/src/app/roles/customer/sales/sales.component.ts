import {Component, OnInit} from '@angular/core';
import {Sale} from '../../../shared/model';
import {ActivatedRoute, Router} from '@angular/router';
import {SaleHelperService} from '../../../shared/services/sale-helper.service';
import {QueryableDatasource, SalesService} from '../../../shared/services';
import {AppService, SnackBarService} from '../../../services';


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class SalesComponent implements OnInit {

    private SIMPLE_NO_CARD_MESSAGE = 'Nessuna vendita disponibile';
    // private SEARCH_NO_CARD_MESSAGE = "Nessuna vendita disponibile con questa query";

    query: any;

    noCardMessage: string;
    id: number;

    private pageSize = 10;

    private queryParams: any;
    ds: QueryableDatasource<Sale>;
    canDelete = false;
    canPay = false;

    constructor(private helper: SaleHelperService,
                private service: SalesService,
                private app: AppService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private snackbar: SnackBarService) {
        this.noCardMessage = this.SIMPLE_NO_CARD_MESSAGE;
        this.id = app.user.id;
        this.ds = new QueryableDatasource<Sale>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.queryParams = Object.assign({}, params);
            if (Object.keys(params).length > 0) {
                this.queryParams.value = new Date(this.queryParams.value);
                return this.search(this.queryParams);
            }
        });
    }

    private updateQueryParams(event) {
        this.queryParams = event;
        return this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    search($event?) {
        $event.id = this.id;
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        return this.updateQueryParams($event);
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
