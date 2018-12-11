import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppService, ExchangeSaleService} from "../../services";
import {ChangeViewService, DateService, NotificationService, SaleHelperService} from "../../services";
import {Sale, User} from "../../shared/model";

@Component({
    templateUrl: './sale-summary.component.html',
    styleUrls: ['../../app.component.css']
})
export class SaleSummaryComponent implements OnInit {

    sale: Sale;
    current_role_view: number;
    hidden: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private saleHelperService: SaleHelperService,
                private dateService: DateService,
                private exchangeSale: ExchangeSaleService,
                private app: AppService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService) {
        this.current_role_view = app.current_role_view;
        this.hidden = true;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.sale = new Sale();
        this.sale.customer = new User();
        this.route.params.subscribe(params => {
            this.updateSale(+params['saleId'])
        })
    }

    updateSale (saleId) {
        this.saleHelperService.findById(saleId)
            .subscribe(res => {
                this.sale = res as Sale;
                if (!this.sale.customer) this.sale.customer = new User();
                if (!this.sale.salesLineItems) this.sale.salesLineItems = [];
                this.saleHelperService.getCustomer(this.sale);
                this.saleHelperService.getSaleLineItems(this.sale);
            }, this._systemError())
    }

    getDate(d) {
       return this.dateService.getDate(d);
    }

    deleteSale() {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            this.sale.customer.firstName + this.sale.customer.lastName + "?");
        if (confirmed) {
            this.saleHelperService.delete(this.sale.id)
                .subscribe( res => {
                    let message = {
                        text: "Vendita eliminata per il cliente " + this.sale.customer.lastName + "!",
                        class: "alert-warning"
                    };
                    this.messageService.sendMessage(message);
                }, this._systemError())
        }
    }

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
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }


}