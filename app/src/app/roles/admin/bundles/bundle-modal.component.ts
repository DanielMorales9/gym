import {Component, Inject, OnInit} from '@angular/core';
import {BundlesService} from '../../../shared/services';
import {Bundle} from '../../../shared/model';
import {SnackBarService} from '../../../services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'bundle-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class BundleModalComponent implements OnInit {

    private DEFAULT_TYPE = "P";

    // TODO add spinner on modal

    bundle: Bundle;
    form: FormGroup;
    loading: boolean = false;

    constructor(private service: BundlesService,
                private builder: FormBuilder,
                private snackbar: SnackBarService,
                public dialogRef: MatDialogRef<BundleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bundle = this.data.bundle;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        if (!this.bundle)
            this.bundle = new Bundle();

        this.buildForm();

    }

    private buildForm() {
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
        })
    }

    get name() {
        return this.form.get("name")
    }

    get price() {
        return this.form.get("price")
    }

    get numSessions() {
        return this.form.get("numSessions")
    }

    get description() {
        return this.form.get("description")
    }

    _success() {
        return (_) => {
            let message = "Il pacchetto " + this.bundle.name + this.data.message;
            this.snackbar.open(message);
            this.loading = false;
            this.onNoClick();
        }
    }

    submit() {
        this.getBundleFromForm();
        if (this.bundle.id)
            this.service.put(this.bundle).subscribe(this._success(), undefined);
        else {
            delete this.bundle.id;
            this.service.post(this.bundle).subscribe(this._success(), undefined);
        }
    }


    private getBundleFromForm() {
        let bundle = new Bundle();
        bundle.id = this.bundle.id;
        bundle.name = this.name.value;
        bundle.price = this.price.value;
        bundle.description = this.description.value;
        bundle.numSessions = this.numSessions.value;
        bundle.disabled = (this.bundle.disabled !== undefined) ? this.bundle.disabled : false;
        bundle.type = this.DEFAULT_TYPE;
        this.bundle = bundle;
    }
}
