import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './customer-hour-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class CustomerHourModalComponent extends BaseCalendarModal {

    constructor(public dialogRef: MatDialogRef<CustomerHourModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    submit() {
        this.close({
            start: this.modalData.event.date,
            userId: this.modalData.userId
        });
    }

}
