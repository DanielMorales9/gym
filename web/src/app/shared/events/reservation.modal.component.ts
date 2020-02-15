import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './reservation.modal.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/search-card-list.css']
})
export class ReservationModalComponent {

    form: FormGroup;

    selected: Map<number, boolean>;
    users: any;
    SIMPLE_NO_CARD_MESSAGE = 'Nessun cliente ha acquistato questo pacchetto';

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<ReservationModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.users = this.data.users;

        this.selected = this.data.selected;
    }

    async close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close(this.selected);
    }

    selectUser(id: any) {
        this.selected[id] = !this.selected[id];
    }
}
