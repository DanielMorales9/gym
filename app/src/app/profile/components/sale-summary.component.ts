import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
    ExchangeSaleService,
    SalesService
} from "../../shared/services";
import {AppService} from "../../app.service";
import {ChangeViewService, NotificationService} from "../../services";

@Component({
    templateUrl: './sale-summary.component.html',
    styleUrls: ['../../app.component.css']
})
export class SaleSummaryComponent implements OnInit {

    sale: any;
    current_role_view: any;
    hidden: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private saleService: SalesService,
                private exchangeSale: ExchangeSaleService,
                private app: AppService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService) {
        this.current_role_view = app.current_role_view;
        this.hidden = true;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            let saleId = +params['saleId'];
            this.updateSale(saleId)
        })
    }

    updateSale (saleId) {
        this.saleService.findById(saleId)
            .subscribe(success => {
                this.sale = success;
                if (!this.sale.customer) {
                    this.saleService.getEndpoint(this.sale._links.customer.href)
                        .subscribe( res => {
                            this.sale.customer = res;
                        })
                }
                if (!this.sale.salesLineItems) {
                    this.saleService.getEndpoint(this.sale._links.salesLineItems.href)
                        .subscribe(res => {
                            this.sale.salesLineItems = [];
                            let salesLineItems = this.sale.salesLineItems;
                            res['_embedded']
                                .salesLineItems
                                .map(res => {
                                    let endpoint = res._links.bundleSpecification.href;
                                    this.saleService.getEndpoint(endpoint)
                                        .subscribe( res1 => {
                                            salesLineItems.push({id: res.id, bundleSpecification: res1});
                                        }, );
                                });
                        }, )
                }
            }, this._systemError())
    }

    getDate(d) {
        let currentdate = new Date(d);
        return currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
    }

    deleteSale() {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            this.sale.customer.firstName + this.sale.customer.lastName + "?");
        if (confirmed) {
            this.saleService.delete(this.sale.id)
                .subscribe( res => {
                    let message = {
                        text: "Vendita eliminata per il cliente " + this.sale.customer.lastName + "!",
                        class: "alert-warning"
                    };
                    this.messageService.sendMessage(message);
                }, this._systemError())
        }
    }

    // TODO: refactor with sales-details
    paySale() {
        this.exchangeSale.sendSale(this.sale)
    }

    endSummary() {
        this.router.navigateByUrl("/")
    }

    toggle() {
        this.hidden = !this.hidden;
    }

    _systemError() {
        return err => {
            console.log(err);
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }


}