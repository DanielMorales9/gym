import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './admin-delete-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class AdminDeleteModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<AdminDeleteModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = this.builder.group({
            name: ['', [Validators.required]]
        });
    }

    submit() {
        switch (this.modalData.event.meta.type) {
            case 'admin':
                this.deleteAdminTimeOff();
                break;
            case 'reservation':
                this.deleteReservation();
                break;
            case 'trainer':
                this.deleteTrainerTimeOff();
                break;
            default:
                this.deleteNotAllowed();
                break;
        }
    }

    private deleteNotAllowed() {
        const data = {
            type: 'notAllowed',
            message: `${this.modalData.event.meta.type} non può essere cancellata dall'admin!`
        };
        this.close(data);
    }

    private deleteReservation() {
        const data = {
            type: 'reservation',
            eventId: this.modalData.event.meta.id
        };
        this.close(data);
    }

    private deleteAdminTimeOff() {
        const data = {
            type: 'admin',
            eventId: this.modalData.event.meta.id
        };
        this.close(data);
    }

    private deleteTrainerTimeOff() {
        const data = {
            type: 'trainer',
            eventId: this.modalData.event.meta.id
        };
        this.close(data);
    }
}
