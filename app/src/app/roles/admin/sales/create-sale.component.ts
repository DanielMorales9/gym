import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BundlesNotDisabledService, UserService} from '../../../shared/services';
import {Bundle, Sale} from '../../../shared/model';
import {AppService, SaleHelperService, SnackBarService} from '../../../services';
import {BundleDataSource} from '../bundles';


@Component({
    templateUrl: './create-sale.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css', '../../../styles/search-card-list.css']
})
export class CreateSaleComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = "Nessun pacchetto disponibile";
    // SEARCH_NO_CARD_MESSAGE = "Nessun pacchetto disponibile con questo nome";

    no_message_card: string;
    current_role_view: number;
    sub: any;

    id : number;
    query: string;
    empty: boolean;

    bundles: Bundle[];
    adminEmail: string;
    sale: Sale;

    private pageSize: number = 10;
    selected: Map<number, boolean> = new Map<number, boolean>();
    ds: BundleDataSource;

    constructor(private app: AppService,
                private router: Router,
                private bundleService: BundlesNotDisabledService,
                private saleHelperService: SaleHelperService,
                private userService: UserService,
                private snackbar: SnackBarService,
                private route: ActivatedRoute) {
        this.current_role_view = this.app.current_role_view;
        this.no_message_card = this.SIMPLE_NO_CARD_MESSAGE;
        this.adminEmail = this.app.user.email;
        this.ds = new BundleDataSource(bundleService, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.createSale()
        });
    }

    ngOnDestroy() {
        this.destroy();
    }

    private createSale() {
        this.saleHelperService.createSale(this.adminEmail, this.id).subscribe((res: Sale) => {
            SaleHelperService.unwrapLines(res);
            this.sale = res;
        })
    }

    private addSalesLineItem(id: number) {

        this.saleHelperService.addSalesLineItem(this.sale.id, id)
            .subscribe( (res: Sale) =>{
                SaleHelperService.unwrapLines(res);
                this.sale = res;
            })
    }

    private deleteSalesLineItem(id: number) {

        let salesLineId = this.sale
            .salesLineItems
            .map(line => [line.id, line.bundleSpecification.id])
            .filter(line => line[1] == id)
            .map(line => line[0])[0];

        this.saleHelperService.deleteSalesLineItem(this.sale.id, salesLineId)
            .subscribe( (res: Sale) => {
                SaleHelperService.unwrapLines(res);
                this.sale = res;
            }, err => {
                this.snackbar.open(err.error.message)
            });
    }

    private destroy() {
        this.sub.unsubscribe();
        if (this.sale) {
            if (!this.sale.completed) {
                this.saleHelperService.delete(this.sale.id)
                    .subscribe(
                        res => { console.log(res)},
                        err => {
                            this.snackbar.open(err.error.message)
                        })
            }
        }
    }

    getBundles() {
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
    }


    confirmSale() {
        this.saleHelperService.confirmSale(this.sale.id)
            .subscribe( (res: Sale) => {
                this.sale = res;
                return this.router.navigate(['admin', 'sales', 'summary', this.sale.id]);
            }, err => {
                this.snackbar.open(err.error.message)
            })
    }

    selectBundle(id: number) {
        let isSelected = !this.getSelectBundle(id);
        this.selected[id] = isSelected;
        if (isSelected)
            this.addSalesLineItem(id);
        else
            this.deleteSalesLineItem(id)

    }

    getSelectBundle(id: number) {
        let isSelected = undefined;
        if (id) {
            if (!this.selected[id])
                this.selected[id] = false;
            isSelected = this.selected[id];
        }
        return isSelected;
    }
}
