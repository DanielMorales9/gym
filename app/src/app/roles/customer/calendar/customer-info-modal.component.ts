import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './customer-info-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class CustomerInfoModalComponent extends BaseCalendarModal {

    constructor(public dialogRef: MatDialogRef<CustomerInfoModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = this.data;
    }

    close(data?) {
        if (!data) {
            data = {type: 'none'};
        }
        this.dialogRef.close(data);
    }

    submit() {
        this.close();
    }

}
