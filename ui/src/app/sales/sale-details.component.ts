import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SalesService} from "../services/sales.service";
import {MessageService} from "../services/message.service";
import {AppService} from "../services/app.service";
import {ExchangeSaleService} from "../services/exchange-sale.service";
import {ChangeViewService} from "../services/change-view.service";

@Component({
    selector: 'sale-details',
    templateUrl: './sale-details.component.html',
    styleUrls: ['../app.component.css']
})
export class SaleDetailsComponent implements OnInit {

    @Input() public sale: any;

    @Output() private event = new EventEmitter();

    hidden: boolean;
    current_role_view: number;

    constructor(private saleService: SalesService,
                private appService: AppService,
                private changeViewService: ChangeViewService,
                private exchangeSale: ExchangeSaleService,
                private messageService: MessageService) {
        this.current_role_view = this.appService.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        if (!this.sale.customer) {
            this.saleService.getEndpoint(this.sale._links.customer.href, res => {
                this.sale.customer = res;
            }, undefined)
        }
    }

    getDate(d) {
        let currentdate = new Date(d);
        return currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();
    }

    toggle() {
        this.hidden = !this.hidden;
        if (!this.sale.salesLineItems) {
            if (this.hidden) {
                this.saleService.getEndpoint(this.sale._links.salesLineItems.href, res => {
                    this.sale.salesLineItems = [];
                    let salesLineItems = this.sale.salesLineItems;
                    res._embedded
                        .salesLineItems
                        .map(res => {
                            let endpoint = res._links.bundleSpecification.href;
                            this.saleService.getEndpoint(endpoint, res1 => {
                                salesLineItems.push({id: res.id, bundleSpecification: res1});
                            }, undefined);
                        });
                }, undefined)
            }
        }
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

    deleteSale() {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            this.sale.customer.firstName + this.sale.customer.lastName + "?");
        if (confirmed) {
            this.saleService.delete(this.sale.id, res => {
                let message = {
                    text: "Vendita eliminata per il cliente " + this.sale.customer.lastName + "!",
                    class: "alert-warning"
                };
                this.event.emit(res);
                this.messageService.sendMessage(message);
            }, this._systemError())
        }
    }


    paySale() {
        this.exchangeSale.sendSale(this.sale)
    }

}