import {Component} from "@angular/core";
import {BaseCalendar} from "./base-calendar";
import {EVENT_TYPES} from "./event-types.enum";


@Component({
    selector: "trainer-calendar",
    templateUrl: './trainer-calendar.component.html',
    styleUrls: ['../../app.component.css']
})
export class TrainerCalendarComponent extends BaseCalendar {

    getEvents() {
        this.events = [];
        this.getReservations();
    }

    getReservations() {
        let {startDay, endDay} = this.getStartAndEndTimeByView();
        this.trainingService
            .getReservations(startDay, endDay)
            .subscribe(res => {
                res.forEach(val => {
                    this.events.push(this.formatEvent(val))
                });
                this.getTimesOff();
            })
    }

    getTimesOff() {
        let {startDay, endDay} = this.getStartAndEndTimeByView();
        this.timesOffService.getTimesOff(startDay, endDay, undefined, "admin")
            .subscribe((value: Object[]) => {
                value.map(res => {
                    this.events.push(this.formatEvent(res))
                });
                this.timesOffService.getTimesOff(startDay, endDay, this.user.id)
                    .subscribe((value: Object[]) => {
                        value.map(res => {
                            this.events.push(this.formatEvent(res))
                        });
                        this.refreshView();
                    })
            });
    }

    header(action: string, event: any) {
        if (event.day.date >= new Date()) {
            let {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(event.day.date));
            this.timesOffService.check(startTime, endTime, "trainer", this.user.id)
                .subscribe(res => {
                this.modalData = {
                    action: EVENT_TYPES.HEADER,
                    title: "Giorno di Ferie",
                    userId: this.user.id,
                    role: this.role,
                    event: event
                };
                this.openModal(action);
            }, err => {
                let message = {
                    text: err.error,
                    class: "alert-danger"
                };
                this.notificationService.sendMessage(message);
            });
        }
    }

    delete(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.DELETE,
            title: `Sei sicuro di voler eliminare la ${event.meta.eventName} ?`,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    hour(action: string, event: any) {
        console.log(action, event)
    }

    info(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.INFO,
            title: event.title,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    openModal(action: string) {
        document.getElementById(`trainer-${action}-modal-button`).click();
    }


}
