import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BundleSpecification, Sale} from '../../shared/model';
import {BundleSpecHelperService, QueryableDatasource, SaleHelperService} from '../../core/helpers';
import {SnackBarService} from '../../core/utilities';
import {BundleService, BundleSpecsService} from '../../core/controllers';
import {MatDialog} from '@angular/material/dialog';
import {OptionSelectModalComponent} from './option-select-modal.component';
import {takeUntil} from 'rxjs/operators';
import {SearchComponent} from '../../shared/search-component';


@Component({
    templateUrl: './create-sale.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSaleComponent extends SearchComponent<BundleSpecification> implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    sub: any;

    id: number;
    query = {disabled: false, name: ''};

    sale: Sale;
    selected: Map<number, boolean> = new Map<number, boolean>();
    optionsSelected: Map<number, boolean> = new Map<number, boolean>();

    constructor(private saleHelper: SaleHelperService,
                private helper: BundleSpecHelperService,
                private specService: BundleSpecsService,
                private bundleService: BundleService,
                private snackbar: SnackBarService,
                private dialog: MatDialog,
                protected router: Router,
                protected route: ActivatedRoute) {
        super(router, route);
        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
        this.getId();
    }

    private getId() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.createSale();
        });
    }

    protected initDefaultQueryParams(params: any): any {
        params.disabled = this.query.disabled;
        params.name = this.query.name;
        return params;
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

    selectBundleSpec(spec: any) {
        this.selected[spec.id] = !this.getSelectBundle(spec.id);

        this.openDialog(spec);

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

    trackBy(index, item) {
        return item ? item.id : index;
    }
}
