import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {SalesService} from "../../services";
import {ExchangeSaleService, NotificationService} from "../../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Sale, User} from "../../model";

@Component({
    selector: 'sale-modal',
    templateUrl: './sale-modal.component.html',
    styleUrls: ['../../../root.css']
})
export class SaleModalComponent implements OnInit {

    @Output() public event = new EventEmitter();
    form: FormGroup;
    loading: boolean;

    public sale: Sale;
    amountDue: number;

    constructor(private service: SalesService,
                private builder: FormBuilder,
                private exchangeSale: ExchangeSaleService,
                private messageService: NotificationService) {
        this.loading = false;
    }

    ngOnInit(): void {
        this.buildForm();
        this.exchangeSale.getSale().subscribe(value => {
            this.sale = value;
            this.buildForm();
        })
    }

    get amount() {
        return this.form.get("amount")
    }


    buildForm() {
        let amountLeft = 0;
        if (this.sale) {
            amountLeft = this.sale.totalPrice - this.sale.amountPayed;
        }
        console.log(amountLeft);
        this.form = this.builder.group({
            amount: [ this.amountDue, [Validators.required, Validators.min(0.001), Validators.max(amountLeft)]]
        });
    }

    _success() {
        return (res) => {
            this.loading = false;
            document.getElementById("payModal").click();
            let message ={
                text: "Sono stati pagati "+ this.amount.value +" Euro!",
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.event.emit("update");
        }
    }

    _error() {
        return (err) => {
            this.loading = false;
            document.getElementById("payModal").click();
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    submit() {
        this.loading = true;
        if (this.amount.value > 0 ) {
            this.service.pay(this.sale.id, this.amount.value).subscribe(this._success(), this._error())
        }
        else {
            this.loading = false;
        }
    }

}