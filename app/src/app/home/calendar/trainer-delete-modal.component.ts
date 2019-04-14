import {Component, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {TimesOffService, TrainingService} from '../../shared/services';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'trainer-delete-modal',
    templateUrl: './trainer-delete-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerDeleteModalComponent extends BaseCalendarModal implements OnInit {


    constructor(private timesOffService: TimesOffService,
                private trainingService: TrainingService,
                public dialogRef: MatDialogRef<TrainerDeleteModalComponent>) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        console.log(this.modalData.event.meta.type);
        switch (this.modalData.event.meta.type) {
            case 'reservation':
                this.deleteReservation();
                break;
            case 'trainer':
                this.deleteTimesOff();
                break;
            default:
                this.message = {
                    text: `${this.modalData.event.meta.type} non può essere cancellata dal trainer!`,
                    class: 'alert-danger'
                };
                this.onComplete();
                break;
        }
    }

    private deleteTimesOff() {
        this.timesOffService.delete(this.modalData.event.meta.id)
            .subscribe(res => {
                this.message = {
                    text: `${this.modalData.event.meta.name} eliminata con successo.`,
                    class: 'alert-warning'
                };
            }, err => {
                this.message = {
                    text: err.error,
                    class: 'alert-danger'
                };
            });
    }

    private deleteReservation() {
        this.trainingService.delete(this.modalData.event.meta.id, 'trainer')
            .subscribe(res => {
                this.message = {
                    text: `${this.modalData.event.title} è stato eliminato.`,
                    class: 'alert-warning'
                };
            }, err => {
                console.log(err);
                this.message = {
                    text: err.error.message,
                    class: 'alert-danger'
                };
            });
    }

}
