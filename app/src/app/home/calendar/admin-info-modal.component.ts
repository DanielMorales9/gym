import {Component, OnInit} from "@angular/core";
import {BaseCalendarModal} from "./base-calendar-modal";
import {DateService, NotificationService} from "../../services";
import {TrainingService} from "../../shared/services";

@Component({
    selector: 'admin-info-modal',
    templateUrl: './admin-info-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class AdminInfoModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON = 'admin-info-modal-button';

    constructor(private dateService: DateService,
                private trainingService: TrainingService,
                public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        if (!this.modalData.event.meta.session.completed && this.modalData.event.meta.confirmed)
            this.complete();
        else this.confirm();
    }

    confirm() {
        this.loading = true;
        let stringDate = this.dateService.getDate(this.modalData.event.start);
        this.trainingService.confirm(this.modalData.event.meta.id)
            .subscribe((res) => {
                this.message = {
                    text: `Prenotazione #${this.modalData.event.meta.id} confermata per il ${stringDate}`,
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
            })
    }

    complete() {
        console.log("completing...");
        console.log(this.modalData);
        this.loading = true;
        let stringDate = this.dateService.getDate(this.modalData.event.start);
        this.trainingService.complete(this.modalData.event.meta.id)
            .subscribe( (res) => {
                this.message = {
                    text: `Allenamento #" + ${this.modalData.event.meta.session.id} completato`,
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
            })
    }

}