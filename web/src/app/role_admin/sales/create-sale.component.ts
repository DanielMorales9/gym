import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BundleSpecification, BundleType, Sale} from '../../shared/model';
import {BundleSpecPayHelperService, QueryableDatasource, SaleHelperService} from '../../core/helpers';
import {SnackBarService} from '../../core/utilities';
import {BundleService, BundleSpecsService} from '../../core/controllers';
import {MatDialog} from '@angular/material/dialog';
import {BundleSelectModalComponent} from './bundle-select-modal.component';


@Component({
    templateUrl: './create-sale.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css']
})
export class CreateSaleComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    sub: any;

    id: number;
    query: string;
    sale: Sale;

    private pageSize = 10;
    selected: Map<number, boolean> = new Map<number, boolean>();
    bundleSelected: Map<number, boolean> = new Map<number, boolean>();

    ds: QueryableDatasource<BundleSpecification>;
    private queryParams: { query: string };

    constructor(private saleHelper: SaleHelperService,
                private helper: BundleSpecPayHelperService,
                private specService: BundleSpecsService,
                private bundleService: BundleService,
                private snackbar: SnackBarService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute) {
        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.getQuery();
        this.getId();
    }

    private getId() {
        this.sub = this.route.params.subscribe(async params => {
            this.id = +params['id'];
            await this.createSale();
        });
    }

    private getQuery() {
        this.query = this.route.snapshot.queryParamMap.get('query');
    }

    private updateQueryParams() {
        this.queryParams = {query: this.query};
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    ngOnDestroy() {
        this.destroy();
    }

    private async createSale() {
        const [data, error] = await this.saleHelper.createSale(this.id);
        if (error) {
            throw error;
        }
        else {
            this.sale = data;
        }
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

    async selectBundleSpec(spec: any) {
        const isSelected = !this.getSelectBundle(spec.id);
        this.selected[spec.id] = isSelected;


        if (isSelected) {
            if (spec.type === BundleType.PERSONAL) {
                this.addSalesLineItem(spec.id);
            }
            if (spec.type === BundleType.COURSE) {
                await this.openDialog(spec);
            }
        } else {
            this.deleteSalesLineItem(spec.id);
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

    private async openDialog(spec) {
        const [bundles, error] = await this.bundleService.searchBySpecIdAndNotExpired({specId: spec.id});
        if (error) {
            throw error;
        }

        const title = 'Scegli Edizione';

        const dialogRef = this.dialog.open(BundleSelectModalComponent, {
            data: {
                title: title,
                spec: spec,
                sale: this.sale,
                bundles: bundles,
                selected: this.bundleSelected
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(res);
            if (res) {
                res.forEach((value, key, map) => {
                    this.bundleSelected[key] = value;
                });

                let acc = false;
                for (const key in res) {
                    acc = acc || res[key];
                }
                this.selected[spec.id] = acc;
            }
            else {
                this.selected[spec.id] = false;
            }
        });

    }
}
