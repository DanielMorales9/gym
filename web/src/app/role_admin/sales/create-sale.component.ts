import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BundleSpecification, BundleType, Sale} from '../../shared/model';
import {BundleSpecHelperService, QueryableDatasource, SaleHelperService} from '../../core/helpers';
import {SnackBarService} from '../../core/utilities';
import {BundleService, BundleSpecsService} from '../../core/controllers';
import {MatDialog} from '@angular/material/dialog';
import {OptionSelectModalComponent} from './option-select-modal.component';
import {first, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/base-component';


@Component({
    templateUrl: './create-sale.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css']
})
export class CreateSaleComponent extends BaseComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    sub: any;

    id: number;
    query = {disabled: false, name: ''};
    sale: Sale;

    private pageSize = 10;
    selected: Map<number, boolean> = new Map<number, boolean>();
    optionsSelected: Map<number, boolean> = new Map<number, boolean>();

    ds: QueryableDatasource<BundleSpecification>;
    private queryParams: any;

    constructor(private saleHelper: SaleHelperService,
                private helper: BundleSpecHelperService,
                private specService: BundleSpecsService,
                private bundleService: BundleService,
                private snackbar: SnackBarService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute) {
        super();
        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
        this.getId();
    }

    private getId() {
        this.sub = this.route.params.subscribe(async params => {
            this.id = +params['id'];
            await this.createSale();
        });
    }

    private initQueryParams() {
        this.route.queryParams.pipe(first()).subscribe(params => {
            this.queryParams = Object.assign({}, params);
            this.queryParams.disabled = this.query.disabled;
            this.queryParams.name = this.query.name;
            this.search(this.queryParams);
        });
    }

    private updateQueryParams($event) {
        if (!$event) { $event = {}; }

        this.queryParams = this.query = $event;
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    ngOnDestroy() {
        this.destroy();
        super.ngOnDestroy();
    }

    private createSale() {
        this.saleHelper.createSale(this.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => this.sale = res);
    }

    private addSalesLineItem(id: number) {
        this.saleHelper.addSalesLineItem(this.sale.id, id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => this.sale = res);
    }

    private deleteSalesLineItem(id: number) {
        const salesLineId = this.sale
            .salesLineItems
            .map(line => [line.id, line.bundleSpecification.id])
            .filter(line => line[1] === id)
            .map(line => line[0])[0];

        this.saleHelper.deleteSalesLineItem(this.sale.id, salesLineId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => this.sale = res, error => this.snackbar.open(error.error.message));
    }

    private destroy() {
        this.sub.unsubscribe();
        if (this.sale) {
            if (!this.sale.completed) {
                this.saleHelper.delete(this.sale.id)
                    .subscribe(
                        res => {},
                        err => {
                            this.snackbar.open(err.error.message);
                        });
            }
        }
    }

    search($event) {
        Object.keys($event).forEach(key => {
            if ($event[key] === undefined) {
                delete $event[key];
            }
            if ($event[key] === '') {
                delete $event[key];
            }
        });
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }


    confirmSale() {
        this.saleHelper.confirmSale(this.sale.id)
            .subscribe( (res: Sale) => {
                this.sale = res;
                return this.router.navigate(['admin', 'sales', this.sale.id], {
                    replaceUrl: true
                });
            }, err => {
                this.snackbar.open(err.error.message);
            });
    }

    async selectBundleSpec(spec: any) {
        const isSelected = !this.getSelectBundle(spec.id);
        this.selected[spec.id] = isSelected;

        if (spec.type === BundleType.COURSE) {
            this.openDialog(spec);
        } else if (isSelected) {
            this.addSalesLineItem(spec.id);
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

    private openDialog(spec) {
        const title = 'Scegli Opzione';

        const dialogRef = this.dialog.open(OptionSelectModalComponent, {
            data: {
                title: title,
                spec: spec,
                sale: this.sale,
                selected: this.optionsSelected
            }
        });


        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.sale = res.sale;
                res = res.selected;
                for (const key in res) {
                    this.optionsSelected[key] = res[key];
                }

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
