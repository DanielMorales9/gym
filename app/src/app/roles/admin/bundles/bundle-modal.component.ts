import {Component, EventEmitter, Inject, Input, OnInit, Output} from "@angular/core";
import {BundlesService} from "../../../shared/services";
import {Bundle} from "../../../shared/model";
import {ExchangeBundleService, NotificationService} from "../../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'bundle-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../../root.css']
})
export class BundleModalComponent implements OnInit {

    private DEFAULT_TYPE = "P";

    // TODO add spinner on modal

    bundle: Bundle;
    form: FormGroup;
    loading: boolean = false;

    constructor(private service: BundlesService,
                private builder: FormBuilder,
                private exchangeBundleService: ExchangeBundleService,
                private messageService: NotificationService,
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
            let message ={
                text: "Il pacchetto " + this.bundle.name + this.data.message,
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
        }
    }

    _error() {
        return (err) => {
            let message ={
                text: "Qualcosa è andato storto",
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
            this.onNoClick()
        }
    }

    submit() {
        this.getBundleFromForm();
        if (this.bundle.id)
            this.service.put(this.bundle).subscribe(this._success(), this._error(), () => {
                this.onNoClick();
                this.loading = false;
            });
        else {
            delete this.bundle.id;
            this.service.post(this.bundle).subscribe(this._success(), this._error(), () => {
                this.onNoClick();
                this.loading = false;
            });
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