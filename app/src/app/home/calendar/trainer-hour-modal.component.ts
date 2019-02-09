import {Component, OnInit} from "@angular/core";
import {DateService, NotificationService} from "../../services";
import {BaseCalendarModal} from "./base-calendar-modal";
import {TimesOffService} from "../../shared/services";

@Component({
    selector: 'trainer-hour-modal',
    templateUrl: './trainer-hour-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class TrainerHourModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'trainer-hour-modal-button';

    timeOffName: string;

    constructor(public notificationService: NotificationService,
                private timesOffService: TimesOffService,
                private dateService: DateService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON
    }

    submit() {
        this.loading = true;
        let startTime = new Date(this.modalData.event.date);
        let endTime = this.dateService.addHour(startTime);
        let startDate = this.dateService.getStringDate(startTime);
        this.timesOffService.book(startTime, endTime, 'trainer', this.timeOffName, this.modalData.userId)
            .subscribe((res) => {
                this.message = {
                    text: `Ferie confermate per il ${startDate}`,
                    class: "alert-success"
                };
                this.event.emit();
            }, (err) => {
                this.message = {
                    text: err.message,
                    class: "alert-danger"
                };
                this.timeOffName = "";
                this.onComplete()
            }, () => {
                this.timeOffName = "";
                this.onComplete();
            });
    }

}