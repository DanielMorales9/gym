import {Component, OnInit} from "@angular/core";
import {NotificationService} from "../../services";
import {TimesOffService, TrainingService} from "../../shared/services";
import {BaseCalendarModal} from "./base-calendar-modal";

@Component({
    selector: 'trainer-delete-modal',
    templateUrl: './trainer-delete-modal.component.html',
    styleUrls: ['../../root.css']
})
export class TrainerDeleteModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON = 'trainer-delete-modal-button';

    constructor(private timesOffService: TimesOffService,
                private trainingService: TrainingService,
                public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        console.log(this.modalData.event.meta.type);
        this.loading = true;
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
                this.event.emit();
            }, err => {
                this.message = {
                    text: err.error,
                    class: 'alert-danger'
                };
                this.onComplete();
            }, () => {
                this.onComplete();
            });
    }

    private deleteReservation() {
        this.trainingService.delete(this.modalData.event.meta.id, 'trainer')
            .subscribe(res => {
                this.message = {
                    text: `${this.modalData.event.title} è stato eliminato.`,
                    class: 'alert-warning'
                };
                this.event.emit();
            }, err => {
                console.log(err);
                this.message = {
                    text: err.error.message,
                    class: 'alert-danger'
                };
                this.onComplete();
            }, () => {
                this.onComplete();
            });
    }

}