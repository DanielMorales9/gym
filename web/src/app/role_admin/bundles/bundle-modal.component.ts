import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'bundle-spec-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class BundleModalComponent implements OnInit {

    specId: any;
    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<BundleModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.specId = this.data.specId;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required),
            startTime: new FormControl('', Validators.required),
        });

    }

    get name() {
        return this.form.get('name');
    }

    get startTime() {
        return this.form.get('startTime');
    }

    submit() {
        this.dialogRef.close({
            specId: this.specId,
            name: this.name.value,
            startTime: this.startTime.value
        });
    }
}
