import {Component} from '@angular/core';
import {BaseCalendar} from '../../shared/components/calendar';
import {EVENT_TYPES} from '../../shared/components/calendar/event-types.enum';
import {TimesOffService, TrainingService, UserService} from '../../shared/services';
import {CalendarFacade, DateService, GymConfigurationService} from '../../services';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'trainer-calendar',
    templateUrl: './trainer-calendar.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerCalendarComponent extends BaseCalendar {

    constructor(public userService: UserService,
                private trainingService: TrainingService,
                private gymConf: GymConfigurationService,
                private timesOffService: TimesOffService,
                private dateService: DateService,
                public facade: CalendarFacade,
                public activatedRoute: ActivatedRoute) {
        super(facade, activatedRoute);
    }

    change(action: string, event: any) {
        if (event.newStart >= new Date()) {
            const type = 'trainer';
            this.timesOffService.check(event.newStart, event.newEnd, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.CHANGE,
                        title: 'Orario di Ferie',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('trainer-changeTimeOff-modal-button').click();
                }, err => {
                    const message = {
                        text: err.error,
                        class: 'alert-danger'
                    };
                });
        }
    }

    getEvents() {
        this.events = [];
        this.getReservations();
    }

    getReservations() {
        const {startDay, endDay} = this.getStartAndEndTimeByView();
        this.trainingService
            .getReservations(startDay, endDay)
            .subscribe(res => {
                res.forEach(val => {
                    this.events.push(this.formatEvent(val));
                });
                this.getTimesOff();
            });
    }

    getTimesOff() {
        const {startDay, endDay} = this.getStartAndEndTimeByView();
        this.timesOffService.getTimesOff(startDay, endDay, undefined, 'admin')
            .subscribe((value: Object[]) => {
                value.map(res => {
                    this.events.push(this.formatEvent(res));
                });
                this.timesOffService.getTimesOff(startDay, endDay, this.user.id).subscribe((values: Object[]) => {

                        values.map(res => {
                            const evt = this.formatEvent(res);
                            this.events.push(evt);
                        });
                        this.refreshView();
                    });
            });
    }

    header(action: string, event: any) {
        if (event.day.date >= new Date()) {
            const {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(event.day.date));
            this.timesOffService.check(startTime, endTime, 'trainer')
                .subscribe(res => {
                this.modalData = {
                    action: EVENT_TYPES.HEADER,
                    title: 'Giorno di Ferie',
                    userId: this.user.id,
                    role: this.role,
                    event: event
                };
                this.openModal(action);
            }, err => {
                const message = {
                    text: err.error,
                    class: 'alert-danger'
                };
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
            const type = 'trainer';
            const startTime = new Date(event.date);
            const endTime = this.dateService.addHour(startTime);
            this.timesOffService.check(startTime, endTime, type)
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.HOUR,
                        title: 'Orario di Ferie',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    document.getElementById('trainer-hour-modal-button').click();
                }, err => {
                    const message = {
                        text: err.error,
                        class: 'alert-danger'
                    };
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
