import {Component, Inject, OnInit} from '@angular/core';
import {Bundle} from '../../../shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'bundle-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class BundleModalComponent implements OnInit {

    private DEFAULT_TYPE = 'P';
    bundle: Bundle;

    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<BundleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bundle = this.data.bundle;
    }

    ngOnInit(): void {
        if (!this.bundle) {
            this.bundle = new Bundle();
        }

        this.buildForm();

    }

    private buildForm() {
        const type = this.bundle.type || this.DEFAULT_TYPE;
        this.form = this.builder.group({
            name: [this.bundle.name, [Validators.required]],
            price: [this.bundle.price, [
                Validators.required,
                Validators.pattern(/^\d+\.?\d{0,2}$/)
            ]],
            numSessions: [this.bundle.numSessions, [
                Validators.required,
                Validators.pattern(/^\d+$/)
            ]],
            description: [this.bundle.description, Validators.required ],
            type: [type, Validators.required ],
        });
    }

    get name() {
        return this.form.get('name');
    }

    get price() {
        return this.form.get('price');
    }

    get numSessions() {
        return this.form.get('numSessions');
    }

    get description() {
        return this.form.get('description');
    }

    get type() {
        return this.form.get('type');
    }


    submit() {
        this.getBundleFromForm();
        this.dialogRef.close(this.bundle);
    }

    private getBundleFromForm() {
        const bundle = new Bundle();
        bundle.id = this.bundle.id;
        bundle.name = this.name.value;
        bundle.price = this.price.value;
        bundle.description = this.description.value;
        bundle.numSessions = this.numSessions.value;
        bundle.type = this.type.value;
        bundle.disabled = (this.bundle.disabled !== undefined) ? this.bundle.disabled : false;
        this.bundle = bundle;
    }
}
