import {Component, Inject, OnInit} from '@angular/core';
import {BundleSpecification, BundleSpecificationType, CourseBundleSpecification, PersonalBundleSpecification} from '../model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'bundle-spec-modal',
    templateUrl: './bundle-spec-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class BundleSpecModalComponent implements OnInit {

    bundleSpec: any;
    form: FormGroup;
    showPersonal: boolean;
    showCourse: boolean;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<BundleSpecModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bundleSpec = this.data.bundle;
    }

    ngOnInit(): void {
        const hasBundle = !!this.bundleSpec;
        if (!hasBundle) {
            this.bundleSpec = new PersonalBundleSpecification();
        }
        if (this.bundleSpec.type === BundleSpecificationType.PERSONAL) {
            this.showCourse = false;
            this.showPersonal = true;
        }
        else {
            this.showCourse = true;
            this.showPersonal = false;
        }

        this.buildForm(hasBundle);
    }

    private buildForm(hasBundle: boolean) {
        console.log(this.bundleSpec);
        this.form = new FormGroup({
            name: new FormControl(this.bundleSpec.name, Validators.required),
            price: new FormControl({
                value: this.bundleSpec.price,
                disabled: this.bundleSpec.type !== BundleSpecificationType.PERSONAL
            }, [
                Validators.required,
                Validators.pattern(/^\d+\.?\d{0,2}$/)
            ]),
            description: new FormControl(this.bundleSpec.description, Validators.required),
            type: new FormControl({
                value: this.bundleSpec.type,
                disabled: hasBundle,
            }, Validators.required),
            maxCustomers: new FormControl({
                value: this.bundleSpec.maxCustomers,
                disabled: this.bundleSpec.type !== BundleSpecificationType.COURSE
            }, [
                Validators.required,
                Validators.min(2)
            ]),
            numSessions: new FormControl({
                value: this.bundleSpec.numSessions,
                disabled: this.bundleSpec.type !== BundleSpecificationType.PERSONAL
            }, [
                Validators.required,
                Validators.pattern(/^\d+$/)
            ])
        });

        this.type.valueChanges.subscribe(val => {
            if (val === BundleSpecificationType.PERSONAL) {
                this.showCourse = false;
                this.showPersonal = true;

                this.numSessions.enable();
                this.price.enable();
                this.maxCustomers.disable();
            }
            else {
                this.showCourse = true;
                this.showPersonal = false;

                this.numSessions.disable();
                this.price.disable();
                this.maxCustomers.enable();
            }
            this.form.updateValueAndValidity();
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

    get maxCustomers() {
        return this.form.get('maxCustomers');
    }

    submit() {
        const bundle = this.getBundleFromForm();
        this.dialogRef.close(bundle);
    }

    private getBundleFromForm(): BundleSpecification {
        let bundle;
        if (this.type.value === BundleSpecificationType.PERSONAL) {
            bundle = new PersonalBundleSpecification();
            bundle.numSessions = this.numSessions.value;
            bundle.price = this.price.value;
        }
        else {
            bundle = new CourseBundleSpecification();
            bundle.maxCustomers = this.maxCustomers.value;
        }

        bundle.id = this.bundleSpec.id;
        bundle.name = this.name.value;
        bundle.description = this.description.value;
        bundle.type = this.type.value;
        bundle.disabled = (this.bundleSpec.disabled !== undefined) ? this.bundleSpec.disabled : false;
        return bundle;
    }
}
