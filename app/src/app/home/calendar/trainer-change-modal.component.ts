import {Component, OnInit} from "@angular/core";
import {DateService, NotificationService} from "../../services";
import {BaseCalendarModal} from "./base-calendar-modal";
import {TimesOffService} from "../../shared/services";

@Component({
    selector: 'trainer-change-modal',
    templateUrl: './trainer-change-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerChangeModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'trainer-change-modal-button';

    constructor(public notificationService: NotificationService,
                private timesOffService: TimesOffService,
                private dateService: DateService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        this.loading = true;
        let startTime = this.modalData.event.newStart;
        let endTime = this.modalData.event.newEnd;
        let timeOffId = this.modalData.event.event.meta.id;
        let startDate = this.dateService.getStringDate(startTime);
        this.timesOffService.change(timeOffId, startTime, endTime, this.modalData.event.event.meta.name, "trainer")
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
                this.onComplete()
            }, () => {
                this.onComplete();
            });
    }

}
