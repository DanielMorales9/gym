import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './customer-delete-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerDeleteModalComponent extends BaseCalendarModal {


    constructor(public dialogRef: MatDialogRef<CustomerDeleteModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    submit() {
        this.close(this.modalData.event.meta);
    }

}