import {Component} from "@angular/core";
import {BaseCalendar} from "./base-calendar";
import {EVENT_TYPES} from "./event-types.enum";
import {TimesOffService, TrainingService, UserHelperService, UserService} from "../../shared/services";
import {DateService, GymConfigurationService, NotificationService} from "../../services";


@Component({
    selector: "trainer-calendar",
    templateUrl: './trainer-calendar.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerCalendarComponent extends BaseCalendar {

    constructor(public userService: UserService,
                private trainingService: TrainingService,
                private gymConf: GymConfigurationService,
                private timesOffService: TimesOffService,
                private dateService: DateService,
                private notificationService: NotificationService) {
        super(userService);
    }

    change(action: string, event: any) {
        if (event.newStart >= new Date()) {
            let type = "trainer";
            this.timesOffService.check(event.newStart, event.newEnd, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.CHANGE,
                        title: "Orario di Ferie",
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('trainer-change-modal-button').click();
                }, err => {
                    let message = {
                        text: err.error,
                        class: "alert-danger"
                    };
                    this.notificationService.sendMessage(message);
                });
        }
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
                this.timesOffService.getTimesOff(startDay, endDay, this.user.id).subscribe((values: Object[]) => {

                        values.map(res => {
                            let evt = this.formatEvent(res);
                            this.events.push(evt)
                        });
                        this.refreshView();
                    })
            });
    }

    header(action: string, event: any) {
        if (event.day.date >= new Date()) {
            let {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(event.day.date));
            this.timesOffService.check(startTime, endTime, "trainer")
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
        console.log(event);
        if (event.date >= new Date()) {
            let type = "trainer";
            let startTime = new Date(event.date);
            let endTime = this.dateService.addHour(startTime);
            this.timesOffService.check(startTime, endTime, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.HOUR,
                        title: "Orario di Ferie",
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('trainer-hour-modal-button').click();
                }, err => {
                    let message = {
                        text: err.error,
                        class: "alert-danger"
                    };
                    this.notificationService.sendMessage(message);
                });
        }    }

    info(action: string, event: any) {
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

    openModal(action: string) {
        document.getElementById(`trainer-${action}-modal-button`).click();
    }


}
