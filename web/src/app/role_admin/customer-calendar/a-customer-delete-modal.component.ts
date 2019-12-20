import {Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './a-customer-delete-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class ACustomerDeleteModalComponent extends BaseCalendarModal {


    constructor(public dialogRef: MatDialogRef<ACustomerDeleteModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    submit() {
        this.close(this.modalData.event.meta);
    }

}
