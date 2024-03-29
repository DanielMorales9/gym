import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {UserIndex} from '../../shared/model';
import {Router} from '@angular/router';

@Component({
    templateUrl: './trainer-info-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerInfoModalComponent extends BaseCalendarModal {

    constructor(public dialogRef: MatDialogRef<TrainerInfoModalComponent>,
                private router: Router,
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
            eventId: this.modalData.event.meta.reservations[0].id,
            start: this.modalData.event.start,
            type: 'confirm',
        });
    }

    complete() {
        this.close({
            eventId: this.modalData.event.meta.id,
            start: this.modalData.event.start,
            type: 'complete',
        });
    }

    info() {
        const root = UserIndex[this.modalData.role];
        this.router.navigate([root, 'events', this.modalData.event.meta.id]);
        this.dialogRef.close();
    }
}
