import {Component, OnInit} from "@angular/core";
import {DateService, NotificationService} from "../../services";
import {BaseCalendarModal} from "./base-calendar-modal";
import {TimesOffService} from "../../shared/services";

@Component({
    selector: 'admin-change-modal',
    templateUrl: './admin-change-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class AdminChangeModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'admin-change-modal-button';

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
        this.timesOffService.change(timeOffId, startTime, endTime, this.modalData.event.event.meta.name, "admin")
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
                this.onComplete()
            }, () => {
                this.onComplete();
            });
    }

}