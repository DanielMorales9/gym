import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SalesService} from '../../../shared/services';
import {Sale} from '../../../shared/model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SnackBarService} from '../../../services';

@Component({
    selector: 'sales-modal',
    templateUrl: './sales-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class SalesModalComponent implements OnInit {

    form: FormGroup;
    loading: boolean;

    sale: Sale;
    amountDue: number;

    constructor(private service: SalesService,
                private builder: FormBuilder,
                private snackbar: SnackBarService,
                public dialogRef: MatDialogRef<SalesModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.sale = this.data.sale;
        this.loading = false;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    onNoClick(): void {
        this.dialogRef.close();
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

    _success() {
        return (res) => {
            this.loading = false;
            this.onNoClick();
            this.snackbar.open("Sono stati pagati "+ this.amount.value +" euro!");
        }
    }

    submit() {
        this.loading = true;
        if (this.amount.value > 0 )
            this.service.pay(this.sale.id, this.amount.value).subscribe(this._success());
        else
            this.loading = false;

    }

}
