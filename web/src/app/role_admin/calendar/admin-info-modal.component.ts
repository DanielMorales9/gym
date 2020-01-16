import {Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './admin-info-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class AdminInfoModalComponent extends BaseCalendarModal {

    constructor(public dialogRef: MatDialogRef<AdminInfoModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = this.data;
    }

    submit() {
        if (!this.modalData.event.meta.session.completed && this.modalData.event.meta.reservation.confirmed) {
            this.complete();
        } else { this.confirm(); }
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

    close(data?) {
        if (!data) {
            data = {type: 'none'};
        }
        this.dialogRef.close(data);
    }

}
