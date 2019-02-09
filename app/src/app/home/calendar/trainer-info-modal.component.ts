import {Component, OnInit} from "@angular/core";
import {BaseCalendarModal} from "./base-calendar-modal";
import {DateService, NotificationService} from "../../services";
import {TrainingService} from "../../shared/services";

@Component({
    selector: 'trainer-info-modal',
    templateUrl: './trainer-info-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class TrainerInfoModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON = 'trainer-info-modal-button';

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
        let stringDate = this.dateService.getStringDate(this.modalData.event.start);
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
        this.loading = true;
        let stringDate = this.dateService.getStringDate(this.modalData.event.start);
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