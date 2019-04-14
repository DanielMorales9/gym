import {Component, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar/base-calendar-modal';
import {DateService, NotificationService} from '../../services';
import {TrainingService} from '../../shared/services';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'trainer-info-modal',
    templateUrl: './trainer-info-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerInfoModalComponent extends BaseCalendarModal implements OnInit {


    constructor(private dateService: DateService,
                public dialogRef: MatDialogRef<TrainerInfoModalComponent>,
                private trainingService: TrainingService) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        if (!this.modalData.event.meta.session.completed && this.modalData.event.meta.confirmed) {
            this.complete();
        } else { this.confirm(); }
    }

    confirm() {
        const stringDate = this.dateService.getStringDate(this.modalData.event.start);
        this.trainingService.confirm(this.modalData.event.meta.id)
            .subscribe((res) => {
                this.message = {
                    text: `Prenotazione #${this.modalData.event.meta.id} confermata per il ${stringDate}`,
                    class: 'alert-success'
                };
            }, (err) => {
                this.message = {
                    text: err.error.message,
                    class: 'alert-danger'
                };
            });
    }

    complete() {
        const stringDate = this.dateService.getStringDate(this.modalData.event.start);
        this.trainingService.complete(this.modalData.event.meta.id)
            .subscribe( (res) => {
                this.message = {
                    text: `Allenamento #" + ${this.modalData.event.meta.session.id} completato`,
                    class: 'alert-success'
                };
            }, (err) => {
                this.message = {
                    text: err.error.message,
                    class: 'alert-danger'
                };
            });
    }

}
