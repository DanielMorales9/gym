import {Component, Inject, OnInit} from '@angular/core';
import {BundleSpecification, BundleSpecificationType, CourseBundleSpecification, PersonalBundleSpecification} from '../../model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {rangeValidator, timeValidator} from '../../directives';

@Component({
    selector: 'bundle-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class BundleModalComponent implements OnInit {

    bundle: any;
    form: FormGroup;
    showPersonal: boolean;
    showCourse: boolean;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<BundleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bundle = this.data.bundle;
    }

    ngOnInit(): void {
        const hasBundle = !!this.bundle;
        if (!hasBundle) {
            this.bundle = new PersonalBundleSpecification();
        }
        if (this.bundle.type === BundleSpecificationType.PERSONAL) {
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
        console.log(this.bundle);
        this.form = new FormGroup({
            name: new FormControl(this.bundle.name, Validators.required),
            price: new FormControl(this.bundle.price, [
                Validators.required,
                Validators.pattern(/^\d+\.?\d{0,2}$/)
            ]),
            description: new FormControl(this.bundle.description, Validators.required),
            type: new FormControl({
                value: this.bundle.type,
                disabled: hasBundle,
            }, Validators.required),
            startTime: new FormControl({
                value: new Date(this.bundle.startTime),
                disabled: this.bundle.type !== BundleSpecificationType.COURSE
            },  [
                Validators.required
            ]),
            endTime: new FormControl({
                value: new Date(this.bundle.endTime),
                disabled: this.bundle.type !== BundleSpecificationType.COURSE
            },  [
                Validators.required,
            ]),
            maxCustomers: new FormControl({
                value: this.bundle.maxCustomers,
                disabled: this.bundle.type !== BundleSpecificationType.COURSE
            }, [
                Validators.required,
                Validators.min(2)
            ]),
            numSessions: new FormControl({
                value: this.bundle.numSessions,
                disabled: this.bundle.type !== BundleSpecificationType.PERSONAL
            }, [
                Validators.required,
                Validators.pattern(/^\d+$/)
            ])
        }, [
            timeValidator('startTime', 'endTime').bind(this)
        ]);

        this.type.valueChanges.subscribe(val => {
            if (val === BundleSpecificationType.PERSONAL) {
                this.showCourse = false;
                this.showPersonal = true;

                this.numSessions.enable();
                this.startTime.disable();
                this.endTime.disable();
                this.maxCustomers.disable();
            }
            else {
                this.showCourse = true;
                this.showPersonal = false;

                this.numSessions.disable();
                this.startTime.enable();
                this.endTime.enable();
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

    get startTime() {
        return this.form.get('startTime');
    }

    get endTime() {
        return this.form.get('endTime');
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
        }
        else {
            bundle = new CourseBundleSpecification();
            bundle.maxCustomers = this.maxCustomers.value;
            bundle.startTime = this.startTime.value;
            bundle.endTime = this.endTime.value;
        }

        bundle.id = this.bundle.id;
        bundle.name = this.name.value;
        bundle.price = this.price.value;
        bundle.description = this.description.value;
        bundle.type = this.type.value;
        bundle.disabled = (this.bundle.disabled !== undefined) ? this.bundle.disabled : false;
        return bundle;
    }
}
