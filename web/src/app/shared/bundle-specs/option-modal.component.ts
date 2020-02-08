import {Component, Inject, OnInit} from '@angular/core';
import {Option} from '../model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './option-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class OptionModalComponent implements OnInit {

    option: Option;
    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<OptionModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.option = this.data.bundle;
    }

    ngOnInit(): void {
        const hasOption = !!this.option;
        if (!hasOption) {
            this.option = new Option();
        }

        this.buildForm(hasOption);
    }

    private buildForm(hasOption: boolean) {
        this.form = new FormGroup({
            name: new FormControl(this.option.name, Validators.required),
            price: new FormControl({
                value: this.option.price,
                disabled: !!this.option.price
            }, [
                Validators.required,
                Validators.pattern(/^\d+\.?\d{0,2}$/)
            ]),
            number: new FormControl({
                value: this.option.number,
                disabled: !!this.option.number
            }, [
                Validators.required,
                Validators.pattern(/^\d+$/)
            ])
        });
    }

    get name() {
        return this.form.get('name');
    }

    get price() {
        return this.form.get('price');
    }

    get number() {
        return this.form.get('number');
    }

    submit() {
        const bundle = this.getBundleFromForm();
        this.dialogRef.close(bundle);
    }

    private getBundleFromForm(): Option {
        const option = new Option();
        option.id = this.option.id;
        option.name = this.name.value;
        option.price = this.price.value;
        option.number = this.number.value;
        return option;
    }
}
