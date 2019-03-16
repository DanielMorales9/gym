import {Component, OnInit} from "@angular/core";
import {DateService, GymConfigurationService, NotificationService} from "../../services";
import {BaseCalendarModal} from "./base-calendar-modal";
import {TimesOffService} from "../../shared/services";

@Component({
    selector: 'admin-hour-modal',
    templateUrl: './admin-hour-modal.component.html',
    styleUrls: ['../../root.css']
})
export class AdminHourModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'admin-hour-modal-button';

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
        this.timesOffService.book(startTime, endTime, 'admin', this.timeOffName, this.modalData.userId)
            .subscribe((res) => {
                this.message = {
                    text: `Chiusura confermata per il ${startDate}`,
                    class: "alert-success"
                };
                this.event.emit();
            }, (err) => {
                this.message = {
                    text: err.error.message,
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