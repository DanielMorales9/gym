import {Component, OnInit} from "@angular/core";
import {NotificationService} from "../../services";
import {TimesOffService, TrainingService} from "../../shared/services";
import {BaseCalendarModal} from "./base-calendar-modal";

@Component({
    selector: 'admin-delete-modal',
    templateUrl: './admin-delete-modal.component.html',
    styleUrls: ['../../root.css']
})
export class AdminDeleteModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON = 'admin-delete-modal-button';

    constructor(private timesOffService: TimesOffService,
                private trainingService: TrainingService,
                public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        this.loading = true;
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
                this.message = {
                    text: `${this.modalData.event.meta.type} non può essere cancellata dall'admin!`,
                    class: 'alert-danger'
                };
                this.onComplete();
                break;
        }
    }

    private deleteReservation() {
        this.trainingService.delete(this.modalData.event.meta.id, 'admin')
            .subscribe(res => {
                this.message = {
                    text: `${this.modalData.event.title} è stato eliminato.`,
                    class: 'alert-warning'
                };
                this.event.emit();
            }, err => {
                this.message = {
                    text: err.error.message,
                    class: 'alert-danger'
                };
                this.onComplete();
            }, () => {
                this.onComplete();
            });
    }

    private deleteAdminTimeOff() {
        this.timesOffService.delete(this.modalData.event.meta.id)
            .subscribe(res => {
                let that = this;
                setTimeout(function () {
                    that.event.emit();
                }, 1000);
                this.message = {
                    text: `${this.modalData.event.meta.eventName} è stata eliminata!`,
                    class: "alert-warning"
                };
            }, err => {
                this.message = {
                    text: err.error.message,
                    class: "alert-danger"
                };
                this.onComplete();
            }, () => {
                this.onComplete();
            })
    }

    private deleteTrainerTimeOff() {
        this.timesOffService.delete(this.modalData.event.meta.id, 'trainer')
            .subscribe(res => {
                let that = this;
                setTimeout(function () {
                    that.event.emit();
                }, 1000);
                this.message = {
                    text: `${this.modalData.event.meta.eventName} di ${this.modalData.event.meta.user.lastName} è stata eliminata!`,
                    class: "alert-warning"
                };
            }, err => {
                this.message = {
                    text: err.error.message,
                    class: "alert-danger"
                };
                this.onComplete();
            }, () => {
                this.onComplete();
            })
    }
}