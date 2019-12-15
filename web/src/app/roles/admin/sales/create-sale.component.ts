import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BundlePayHelperService, QueryableDatasource} from '../../../shared/services';
import {BundleSpecification, Sale} from '../../../shared/model';
import {SnackBarService} from '../../../services';
import {SaleHelperService} from '../../../shared/services/sale-helper.service';


@Component({
    templateUrl: './create-sale.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css', '../../../styles/search-card-list.css']
})
export class CreateSaleComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';
    // SEARCH_NO_CARD_MESSAGE = "Nessun pacchetto disponibile con questo nome";

    no_message_card: string;
    sub: any;

    id: number;
    query: string;

    gymId: number;
    sale: Sale;

    private pageSize = 10;
    selected: Map<number, boolean> = new Map<number, boolean>();
    ds: QueryableDatasource<BundleSpecification>;
    private queryParams: { query: string };

    constructor(private saleHelper: SaleHelperService,
                private helper: BundlePayHelperService,
                private snackbar: SnackBarService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.no_message_card = this.SIMPLE_NO_CARD_MESSAGE;
        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.getQuery();
        this.getId();
    }

    private getId() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            this.createSale();
        });
    }

    private getQuery() {
        this.query = this.activatedRoute.snapshot.queryParamMap.get('query');
    }

    private updateQueryParams() {
        this.queryParams = {query: this.query};
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    ngOnDestroy() {
        this.destroy();
    }

    private createSale() {
        this.saleHelper.createSale(this.id).subscribe((res: Sale) => {
            this.sale = res;
        });
    }

    private addSalesLineItem(id: number) {

        this.saleHelper.addSalesLineItem(this.sale.id, id)
            .subscribe( (res: Sale) => {
                this.sale = res;
            });
    }

    private deleteSalesLineItem(id: number) {
        const salesLineId = this.sale
            .salesLineItems
            .map(line => [line.id, line.bundleSpecification.id])
            .filter(line => line[1] === id)
            .map(line => line[0])[0];

        this.saleHelper.deleteSalesLineItem(this.sale.id, salesLineId)
            .subscribe( (res: Sale) => {
                this.sale = res;
            }, err => {
                this.snackbar.open(err.error.message);
            });
    }

    private destroy() {
        this.sub.unsubscribe();
        if (this.sale) {
            if (!this.sale.completed) {
                this.saleHelper.delete(this.sale.id)
                    .subscribe(
                        res => { console.log(res); },
                        err => {
                            this.snackbar.open(err.error.message);
                        });
            }
        }
    }

    search($event) {
        this.ds.setQuery($event.query);
        this.ds.fetchPage(0);
        this.updateQueryParams();
    }


    confirmSale() {
        this.saleHelper.confirmSale(this.sale.id)
            .subscribe( (res: Sale) => {
                this.sale = res;
                return this.router.navigate(['admin', 'sales', this.sale.id]);
            }, err => {
                this.snackbar.open(err.error.message);
            });
    }

    selectBundle(id: number) {
        const isSelected = !this.getSelectBundle(id);
        this.selected[id] = isSelected;
        if (isSelected) {
            this.addSalesLineItem(id);
        } else {
            this.deleteSalesLineItem(id);
        }

    }

    getSelectBundle(id: number) {
        let isSelected;
        if (id) {
            if (!this.selected[id]) {
                this.selected[id] = false;
            }
            isSelected = this.selected[id];
        }
        return isSelected;
    }
}
