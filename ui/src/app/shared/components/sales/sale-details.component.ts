import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SalesService, ChangeViewService, NotificationService, ExchangeSaleService} from "../../services";
import {AppService} from "../../../app.service";


@Component({
    selector: 'sale-details',
    templateUrl: './sale-details.component.html',
    styleUrls: ['../../../app.component.css']
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
                private messageService: NotificationService) {
        this.current_role_view = this.appService.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        if (!this.sale.customer) {
            this.saleService.getEndpoint(this.sale._links.customer.href)
                .subscribe( res => {
                    this.sale.customer = res;
                })
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
                this.saleService.getEndpoint(this.sale._links.salesLineItems.href)
                    .subscribe(res => {
                        this.sale.salesLineItems = [];
                        let salesLineItems = this.sale.salesLineItems;
                        res["_embedded"]
                            .salesLineItems
                            .map(res => {
                                let endpoint = res._links.bundleSpecification.href;
                                this.saleService.getEndpoint(endpoint)
                                    .subscribe( res1 => {
                                        salesLineItems.push({id: res.id, bundleSpecification: res1});
                                    });
                            });
                    })
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
            this.saleService.delete(this.sale.id)
                .subscribe( res => {
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