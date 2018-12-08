import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SalesService, ExchangeSaleService} from "../../services";
import {AppService} from "../../../services/app.service";
import {ChangeViewService, NotificationService, SaleHelperService} from "../../../services";
import {Sale, User} from "../../model";
import {DateService} from "../../../services";

@Component({
    selector: 'sale-details',
    templateUrl: './sale-details.component.html',
    styleUrls: ['../../../app.component.css']
})
export class SaleDetailsComponent implements OnInit {

    @Input() public sale: Sale;

    @Output() private event = new EventEmitter();

    hidden: boolean;
    current_role_view: number;

    constructor(private saleService: SalesService,
                private appService: AppService,
                private changeViewService: ChangeViewService,
                private saleHelperService: SaleHelperService,
                private exchangeSale: ExchangeSaleService,
                private dateService: DateService,
                private messageService: NotificationService) {
        this.current_role_view = this.appService.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        if (!this.sale.customer.id) {
            this.saleHelperService.getCustomer(this.sale)
        }
    }

    getDate(d) {
        return this.dateService.getDate(d)
    }

    toggle() {
        this.hidden = !this.hidden;
        if (this.sale.salesLineItems.length == 0) {
            if (this.hidden) {
                this.saleHelperService.getSaleLineItems(this.sale);
            }
        }
    }

    _error() {
        return err => {
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    deleteSale() {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            this.sale.customer.firstName + this.sale.customer.lastName + "?");
        if (confirmed) {
            this.saleHelperService.delete(this.sale.id)
                .subscribe( res => {
                    let message = {
                        text: `Vendita eliminata per il cliente ${this.sale.customer.lastName}!`,
                        class: "alert-warning"
                    };
                    this.event.emit(res);
                    this.messageService.sendMessage(message);
                }, this._error())
        }
    }

    paySale() {
        this.exchangeSale.sendSale(this.sale)
    }

}