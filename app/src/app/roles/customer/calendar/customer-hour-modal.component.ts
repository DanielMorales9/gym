import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BundleSpecificationType} from '../../../shared/model';
import {timeValidator} from '../../../shared/directives';

@Component({
    templateUrl: './customer-hour-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class CustomerHourModalComponent extends BaseCalendarModal implements OnInit {
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<CustomerHourModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
        console.log(this.modalData);
    }


    ngOnInit(): void {
        this.form = new FormGroup({
            bundle: new FormControl(0, Validators.required),
        });
    }

    get bundle() {
        return this.form.get('bundle');
    }

    submit() {
        const startTime = this.modalData.event.date;
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);
        const bundleId = this.bundle.value;
        const userId = this.modalData.userId;

        this.close({
            bundleId: bundleId,
            startTime: startTime,
            endTime: endTime,
            userId: userId
        });
    }


}
