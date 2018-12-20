import {Component} from "@angular/core";
import {BaseCalendar} from "./base-calendar";
import {EVENT_TYPES} from "./event-types.enum";


@Component({
    selector: "customer-calendar",
    templateUrl: './customer-calendar.component.html',
    styleUrls: ['../../app.component.css']
})
export class CustomerCalendarComponent extends BaseCalendar {

    header(action: string, event: any) {
        console.log(action, event)
    }

    hour(action: string, event: any) {
        this.checkAvailability(EVENT_TYPES.HOUR, this.role, event);
        this.openModal(action);
    }

    delete(action: string, event: any) {
        this.modalData = {
            action: action,
            title: `Sei sicuro di voler eliminare la ${event.meta.eventName}?`,
            role: this.role,
            userId: this.user.id,
            event: event
        };
        this.openModal(action);
    }

    info(action: string, event: any) {
        this.modalData = {
            action: action,
            title: event.title,
            role: this.role,
            userId: this.user.id,
            event: event
        };
        this.openModal(action);
    }

    openModal(action) {
        document.getElementById(`customer-${action}-modal-button`).click();
    }

    getEvents() {
        this.events = [];
        this.getReservations();
        // TODO Times Off
    }

    private checkAvailability(action: string, role: number, event: any) {
        if (event.date >= new Date()) {
            this.trainingService.check(event.date, this.user.id)
                .subscribe(res => {
                    this.modalData = {
                        action: action,
                        title: "Prenota il tuo allenamento!",
                        userId: this.user.id,
                        role: role,
                        event: event
                    };
                    document.getElementById('customer-hour-modal-button').click();
                }, err => {
                    this.message = {
                        text: err.error,
                        class: "alert-danger"
                    };
                    this.notificationService.sendMessage(this.message);
                });
        }
    }



    getReservations() {
        let {startDay, endDay} = this.getStartAndEndTimeByView();
        this.trainingService
            .getReservations(startDay, endDay, this.user.id)
            .subscribe(res => {
                res.forEach(val => {
                    this.events.push(this.formatEvent(val))
                });
                this.refreshView()
            })
    }

    getTimesOff() {
    }


}
