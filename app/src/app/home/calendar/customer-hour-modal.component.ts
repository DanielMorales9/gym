import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DateService, NotificationService} from "../../services";
import {TrainingService} from "../../shared/services";
import {BaseCalendarModal} from "./base-calendar-modal";
import {notImplemented} from "@angular/core/src/render3/util";

@Component({
    selector: 'customer-hour-modal',
    templateUrl: './customer-hour-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class CustomerHourModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'customer-hour-modal-button';

    constructor(private dateService: DateService,
                private trainingService: TrainingService,
                public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON
    }

    submit() {
        this.loading = true;
        let currentDate = new Date(this.modalData.event.date);
        let stringDate = this.dateService.getDate(currentDate);
        this.trainingService.book(currentDate, this.modalData.userId)
            .subscribe( (res) => {
                this.message = {
                    text: `Prenotazione effettuata per il ${stringDate}`,
                    class: "alert-success"
                };
                this.event.emit();
            }, (err) => {
                this.message = {
                    text: err.error.message,
                    class: "alert-danger"
                };
                this.onComplete();
            }, () => {
                this.onComplete();
            });
    }

}