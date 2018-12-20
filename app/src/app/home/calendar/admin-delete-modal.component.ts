import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DateService, NotificationService} from "../../services";
import {TimesOffService, TrainingService} from "../../shared/services";
import {BaseCalendarModal} from "./base-calendar-modal";

@Component({
    selector: 'admin-delete-modal',
    templateUrl: './admin-delete-modal.component.html',
    styleUrls: ['../../app.component.css']
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
        if (this.modalData.event.meta.type === 'admin') {
            this.deleteAdminTimeOff();
        }
        else if (this.modalData.event.meta.type === 'reservation') {
            this.trainingService.delete(this.modalData.event.meta.id, 'admin')
                .subscribe(res => {
                    this.message = {
                        text: `${this.modalData.event.title} è stato eliminato.`,
                        class: 'alert-warning'
                    }
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
        else {
            this.message = {
                text: `${this.modalData.event.meta.type} non può essere cancellata dall'admin!`,
                class: 'alert-danger'
            };
            this.onComplete();
        }
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
}