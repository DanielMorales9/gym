import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
    templateUrl: './admin-info-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminInfoModalComponent extends BaseCalendarModal {

    constructor(private router: Router,
                public dialogRef: MatDialogRef<AdminInfoModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = this.data;
    }

    submit() {
        if (!this.modalData.event.meta.reservations[0].session.completed &&
            this.modalData.event.meta.reservations[0].confirmed) {
            this.complete();
        } else { this.confirm(); }
    }

    confirm() {
        this.close({
            type: 'confirm',
            eventId: this.modalData.event.meta.reservation[0].id
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

    info() {
        this.router.navigate(['admin', 'events', this.modalData.event.meta.id]);
        this.dialogRef.close();
    }
}
