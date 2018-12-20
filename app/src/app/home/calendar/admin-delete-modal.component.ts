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
                public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        let type = this.modalData.event.meta.type;
        let isDeletable = ((this.modalData.role == 1 && type == 'admin') ||
            (this.modalData.role < 3 && type == 'trainer'));
        if (isDeletable) {
            this.timesOffService.delete(this.modalData.event.meta.id)
                .subscribe( res => {
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
}