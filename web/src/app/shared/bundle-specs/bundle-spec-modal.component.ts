import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BundleSpecification, BundleSpecificationType, CourseBundleSpecification, PersonalBundleSpecification} from '../model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'bundle-spec-modal',
    templateUrl: './bundle-spec-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleSpecModalComponent implements OnInit {

    bundleSpec: any;
    form: FormGroup;
    showPersonal: boolean;
    showCourse: boolean;
    showNumDeletions: boolean;

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

        this.showNumDeletions = !this.bundleSpec.unlimitedDeletions;

        this.buildForm(hasBundle);
    }

    private buildForm(hasBundle: boolean) {
        this.form = new FormGroup({
            name: new FormControl(this.bundleSpec.name, Validators.required),
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
            unlimitedDeletions: new FormControl({
                value: !!this.bundleSpec.unlimitedDeletions,
                disabled: false
            }, [
                Validators.required
            ]),
            numDeletions: new FormControl({
                value: this.bundleSpec.numDeletions,
                disabled: false
            }, [
                Validators.required,
                Validators.min(0)
            ])
        });

        this.type.valueChanges.subscribe(val => {
            if (val === BundleSpecificationType.PERSONAL) {
                this.showCourse = false;
                this.showPersonal = true;

                this.maxCustomers.disable();
            }
            else {
                this.showCourse = true;
                this.showPersonal = false;

                this.maxCustomers.enable();
            }
            this.form.updateValueAndValidity();
        });

        this.unlimitedDeletions.valueChanges.subscribe(val => {
            if (val === false) {
                this.showNumDeletions = true;
                this.numDeletions.enable();
            }
            else {
                this.showNumDeletions = false;
                this.numDeletions.disable();
            }
            this.form.updateValueAndValidity();
        });
    }

    get name() {
        return this.form.get('name');
    }

    get unlimitedDeletions() {
        return this.form.get('unlimitedDeletions');
    }

    get numDeletions() {
        return this.form.get('numDeletions');
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
        }
        else {
            bundle = new CourseBundleSpecification();
            bundle.maxCustomers = this.maxCustomers.value;
        }

        bundle.unlimitedDeletions = this.unlimitedDeletions.value;
        bundle.numDeletions = !bundle.unlimitedDeletions ? this.numDeletions.value : null;

        bundle.id = this.bundleSpec.id;
        bundle.name = this.name.value;
        bundle.description = this.description.value;
        bundle.type = this.type.value;
        bundle.disabled = (this.bundleSpec.disabled !== undefined) ? this.bundleSpec.disabled : false;
        return bundle;
    }
}
