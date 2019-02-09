import {Component} from "@angular/core";
import {BaseCalendar} from "./base-calendar";
import {EVENT_TYPES} from "./event-types.enum";
import {DateService, GymConfigurationService, NotificationService} from "../../services";
import {TimesOffService, TrainingService, UserHelperService, UserService} from "../../shared/services";
import {User} from "../../shared/model";


@Component({
    selector: "admin-calendar",
    templateUrl: './admin-calendar.component.html',
    styleUrls: ['../../app.component.css']
})
export class AdminCalendarComponent extends BaseCalendar {

    constructor(public userService: UserService,
                private dateService: DateService,
                private trainingService: TrainingService,
                private gymConf: GymConfigurationService,
                private timesOffService: TimesOffService,
                private notificationService: NotificationService) {
        super(userService);
    }

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
                this.timesOffService.getTimesOff(startDay, endDay, undefined, 'trainer')
                    .subscribe((value: Object[]) => {
                        value.map(res => {
                            this.events.push(this.formatEvent(res))
                        });
                        this.refreshView();
                    })
            })
    }

    header(action: string, event: any) {
        console.log(event);
        if (event.day.date >= new Date()) {
            let type = "admin";
            let {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(event.day.date));
            this.timesOffService.check(startTime, endTime, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.HEADER,
                        title: "Giorno di Chiusura",
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('admin-header-modal-button').click();
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
        console.log(event);
        if (event.date >= new Date()) {
            let type = "admin";
            let startTime = new Date(event.date);
            let endTime = this.dateService.addHour(startTime);
            this.timesOffService.check(startTime, endTime, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.HOUR,
                        title: "Ora di Chiusura",
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('admin-hour-modal-button').click();
                }, err => {
                    let message = {
                        text: err.error,
                        class: "alert-danger"
                    };
                    this.notificationService.sendMessage(message);
                });
        }
    }

    info(action: string, event: any) {
        console.log(event);
        event = event.event;
        this.modalData = {
            action: EVENT_TYPES.INFO,
            title: event.title,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    change(action: string, event: any) {
        if (event.newStart >= new Date()) {
            let type = "admin";
            this.timesOffService.checkChange(event.newStart, event.newEnd, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.CHANGE,
                        title: "Ora di Chiusura",
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('admin-change-modal-button').click();
                }, err => {
                    let message = {
                        text: err.error,
                        class: "alert-danger"
                    };
                    this.notificationService.sendMessage(message);
                });
        }
    }

    openModal(action: string) {
        document.getElementById(`admin-${action}-modal-button`).click();
    }


}
