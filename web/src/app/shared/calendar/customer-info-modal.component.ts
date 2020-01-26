import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseCalendarModal} from './base-calendar-modal';

@Component({
    templateUrl: './customer-info-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerInfoModalComponent extends BaseCalendarModal {

    constructor(public dialogRef: MatDialogRef<CustomerInfoModalComponent>,
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

    confirm() {
        this.close({
            type: 'confirm',
            eventId: this.modalData.event.meta.reservation.id
        });
    }

    complete() {
        this.close({
            type: 'complete',
            eventId: this.modalData.event.meta.id
        });
    }

    isReserved() {
        const reservations = this.modalData.event.meta.reservations;
        return reservations.filter(r => r.user.id === this.modalData.userId).length === 1;
    }

    cancel() {
        console.log(this.modalData);
        if (this.modalData.event.meta.type === 'course') {
            const message: any = this.modalData.event.meta;
            message.type = 'delete';
            return this.close(message);
        }
        this.close();
    }
}
