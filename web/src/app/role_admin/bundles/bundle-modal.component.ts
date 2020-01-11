import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CourseBundle} from '../../shared/model';

@Component({
    selector: 'bundle-spec-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class BundleModalComponent implements OnInit {

    bundle: any;
    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<BundleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.bundle = this.data.bundle;
    }

    ngOnInit(): void {
        const hasBundle = !!this.bundle;
        if (!hasBundle) {
            this.bundle = new CourseBundle();
        }
        this.buildForm(hasBundle);
    }

    private buildForm(hasBundle) {
        this.form = new FormGroup({
            name: new FormControl(this.bundle.name, Validators.required),
            startTime: new FormControl(new Date(this.bundle.startTime)),
        });

    }

    get name() {
        return this.form.get('name');
    }

    get startTime() {
        return this.form.get('startTime');
    }

    submit() {
        const bundle = this.getBundle();
        this.dialogRef.close(bundle);
    }

    private getBundle() {
        this.bundle.name = this.name.value;
        this.bundle.startTime = this.startTime.value;
        return this.bundle;
    }
}
