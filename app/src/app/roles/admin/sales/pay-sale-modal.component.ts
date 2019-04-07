import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Sale} from '../../../shared/model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'sales-modal',
    templateUrl: './pay-sale-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class PaySaleModalComponent implements OnInit {

    form: FormGroup;

    sale: Sale;
    amountDue: number;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<PaySaleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.sale = this.data.sale;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    get amount() {
        return this.form.get("amount")
    }

    buildForm() {
        let amountLeft = 0;
        if (this.sale) {
            amountLeft = this.sale.totalPrice - this.sale.amountPayed;
        }
        this.form = this.builder.group({
            amount: [ this.amountDue, [Validators.required, Validators.min(0.001), Validators.max(amountLeft)]]
        });
    }

    submit() {
        if (this.amount.value > 0 )
            this.dialogRef.close({
                sale: this.sale,
                amount: this.amount.value
            });

    }

}
