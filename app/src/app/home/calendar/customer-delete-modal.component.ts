import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DateService, NotificationService} from "../../services";
import {TrainingService} from "../../shared/services";
import {BaseCalendarModal} from "./base-calendar-modal";

@Component({
    selector: 'customer-delete-modal',
    templateUrl: './customer-delete-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class CustomerDeleteModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON = 'customer-delete-modal-button';

    constructor(private trainingService: TrainingService,
                public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        if (this.modalData.event.meta.type == 'reservation'){
            this.loading = true;
            this.trainingService.delete(this.modalData.event.meta.id)
                .subscribe(res => {
                    let that = this;
                    setTimeout(function() {
                        that.event.emit();
                    }, 1000);
                    this.message = {
                        text: "La Prenotazione è stata eliminata!",
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
        else {
            this.message = {
                text: 'Questa azione non è consentita!',
                class: "alert-danger"
            };
            this.onComplete();
        }
    }

}