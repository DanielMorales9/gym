import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './trainer-delete-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerDeleteModalComponent extends BaseCalendarModal {


    constructor(public dialogRef: MatDialogRef<TrainerDeleteModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    submit() {
        const data = this.modalData.event.meta;
        data.eventId = this.modalData.event.meta.id;
        this.close(data);
    }
}
