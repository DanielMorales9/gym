import {Component, OnInit} from "@angular/core";
import {GymConfigurationService, NotificationService} from "../../services";
import {BaseCalendarModal} from "./base-calendar-modal";
import {TimesOffService} from "../../shared/services";

@Component({
    selector: 'trainer-header-modal',
    templateUrl: './trainer-header-modal.component.html',
    styleUrls: ['../../root.css']
})
export class TrainerHeaderModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'trainer-header-modal-button';

    timeOffName: string;

    constructor(public notificationService: NotificationService,
                private timesOffService: TimesOffService,
                private gymConf: GymConfigurationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON
    }

    submit() {
        this.loading = true;
        let {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(this.modalData.event.day.date));
        let stringDate = (startTime);
        this.timesOffService.book(startTime, endTime, 'trainer', this.timeOffName, this.modalData.userId)
            .subscribe((res) => {
                this.message = {
                    text: `Ferie confermate per il ${stringDate}`,
                    class: "alert-success"
                };
                this.event.emit();
            }, (err) => {
                this.message = {
                    text: err.error.message,
                    class: "alert-danger"
                };
                this.onComplete()
            }, () => {
                this.onComplete();
            });
    }

}