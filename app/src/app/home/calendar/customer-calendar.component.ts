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
        if (event.date >= new Date()) {
            this.trainingService.check(event.date, this.user.id)
                .subscribe(res => {
                    this.modalData = {
                        action: action,
                        title: "Prenota il tuo allenamento!",
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal(action);
                }, err => {
                    this.message = {
                        text: err.error,
                        class: "alert-danger"
                    };
                    this.notificationService.sendMessage(this.message);
                });
        }
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
        this.getTimesOff();
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
        let {startDay, endDay} = this.getStartAndEndTimeByView();
        this.timesOffService.getTimesOff(startDay, endDay, undefined, 'admin')
            .subscribe((value : Object[]) => {
                    value.map(res => {
                        this.events.push(this.formatEvent(res))
                    });
                }, undefined,
                () => {
                    this.refreshView();
                })
    }

}
