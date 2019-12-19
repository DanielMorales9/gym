import {Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './trainer-delete-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerDeleteModalComponent extends BaseCalendarModal {


    constructor(public dialogRef: MatDialogRef<TrainerDeleteModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    submit() {
        const data = {
            type: this.modalData.event.meta.type,
            eventId: this.modalData.event.meta.id
        };

        this.close(data);
    }
}
