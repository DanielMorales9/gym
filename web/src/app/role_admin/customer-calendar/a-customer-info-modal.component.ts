import {Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './a-customer-info-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class ACustomerInfoModalComponent extends BaseCalendarModal {

    constructor(public dialogRef: MatDialogRef<ACustomerInfoModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = this.data;
        console.log(this.modalData);
    }

    submit() {
        console.log(this.modalData);
        if (this.modalData.event.meta.type === 'course') {
            return this.close(this.modalData);
        }
        this.close();
    }

    isReserved() {
        const reservations = this.modalData.event.meta.reservations;
        return reservations.filter(r => r.user.id === this.modalData.userId).length === 1;
    }

    cancel() {
        console.log(this.modalData);
        if (this.modalData.event.meta.type === 'course') {
            const message: any = this.modalData.event.meta;
            message.cancel = true;
            return this.close(message);
        }
        this.close();
    }
}
