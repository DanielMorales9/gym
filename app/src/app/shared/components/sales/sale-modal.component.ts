import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SalesService, ExchangeSaleService} from "../../services";
import {NotificationService} from "../../../services";

@Component({
    selector: 'sale-modal',
    templateUrl: './sale-modal.component.html',
    styleUrls: ['../../../app.component.css']
})
export class SaleModalComponent implements OnInit {

    @Output()
    event = new EventEmitter();

    @Input() public modalTitle: string;
    @Input() public modalId: string;
    @Input() public modalCloseId: string;
    id: number;
    sale: { amount: number };

    loading: boolean;

    constructor(private service: SalesService,
                private exchangeSale: ExchangeSaleService,
                private messageService: NotificationService) {
        this.loading = false;
    }

    ngOnInit(): void {
        this.exchangeSale.getSale().subscribe(value => {
            this.id = value.id
        });
        this.sale = {amount: NaN};
    }

    _success() {
        return (res) => {
            this.loading = false;
            document.getElementById(this.modalCloseId).click();
            let message ={
                text: "Sono stai pagati "+this.sale.amount+" Euro!",
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.event.emit("update");
        }
    }

    _error() {
        return (err) => {
            this.loading = false;
            document.getElementById(this.modalCloseId).click();
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    submit() {
        this.loading = true;
        if (this.sale.amount > 0 ) {
            this.service.pay(this.id, this.sale.amount)
                .subscribe(this._success(), this._error())
        }
    }

}