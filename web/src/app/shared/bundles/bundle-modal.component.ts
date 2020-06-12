import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'bundle-spec-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleModalComponent implements OnInit {

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<BundleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bundle = this.data.bundle;
    }

    get endTime() {
        return this.form.get('endTime');
    }

    get startTime() {
        return this.form.get('startTime');
    }

    bundle: any;
    form: FormGroup;

    private static addMonthsToTime(start, nMonths) {
        const end = new Date(start);
        const month = end.getMonth() + nMonths;
        end.setMonth(month);
        return end;
    }

    ngOnInit(): void {
        const bundle = Object.assign({}, this.bundle);
        if (!bundle.startTime) {
            bundle.startTime = new Date();
            bundle.endTime = BundleModalComponent.addMonthsToTime(bundle.startTime, bundle.option.number);
        }

        this.buildForm(bundle);
    }

    private buildForm(bundle) {
        this.form = new FormGroup({
            startTime: new FormControl(new Date(bundle.startTime), Validators.required),
            endTime: new FormControl(new Date(bundle.endTime), Validators.required),
        });

        this.startTime.valueChanges.subscribe(val => {
            const end = BundleModalComponent.addMonthsToTime(val, bundle.option.number);
            this.endTime.setValue(end);
            this.form.updateValueAndValidity();
        });
    }

    submit() {
        const bundle = this.getBundle();
        this.dialogRef.close(bundle);
    }

    private getBundle() {
        this.bundle.startTime = this.startTime.value;
        this.bundle.endTime = this.endTime.value;
        return this.bundle;
    }
}
