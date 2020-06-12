import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {Option} from '../model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './option-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionModalComponent implements OnInit {

    option: Option;
    form: FormGroup;
    numberDescription = 'Numero';
    priceDescription = 'Prezzo';

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<OptionModalComponent>,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.option = new Option();
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
            type: new FormControl({
                value: this.option.type,
                disabled: !!this.option.type
            }, [
                Validators.required
            ]),
            number: new FormControl({
                value: this.option.number,
                disabled: !!this.option.number
            }, [
                Validators.required,
                Validators.pattern(/^\d+$/)
            ])
        });
        this.type.valueChanges.subscribe(val => {
            if (val === 'B') {
                this.numberDescription = 'Numero di sessioni';
            } else {
                this.numberDescription = 'Numero di mesi';
            }

            if (val === 'D') {
                this.priceDescription = 'Prezzo ad allenamento';
            }
            else {
                this.priceDescription = 'Prezzo';
            }
            this.cdr.detectChanges();
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

    get type() {
        return this.form.get('type');
    }

    submit() {
        const bundle = this.getOptionFromForm();
        this.dialogRef.close(bundle);
    }

    private getOptionFromForm(): Option {
        const option = new Option();
        option.id = this.option.id;
        option.name = this.name.value;
        option.price = this.price.value;
        option.type = this.type.value;
        option.number = this.number.value;
        return option;
    }
}
