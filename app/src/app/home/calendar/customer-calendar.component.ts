import {Component} from '@angular/core';
import {TimesOffService, TrainingService, UserService} from '../../shared/services';
import {BaseCalendar} from '../../shared/components/calendar';
import {ActivatedRoute} from '@angular/router';
import {CalendarFacade} from '../../services';


@Component({
    selector: 'customer-calendar',
    templateUrl: './customer-calendar.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerCalendarComponent extends BaseCalendar {

    constructor(public userService: UserService,
                private trainingService: TrainingService,
                private timesOffService: TimesOffService,
                public facade: CalendarFacade,
                public activatedRoute: ActivatedRoute) {
        super(facade, activatedRoute);
    }

    header(action: string, event: any) {
        console.log(action, event);
    }

    hour(action: string, event: any) {
        if (event.date >= new Date()) {
            this.trainingService.check(event.date, this.user.id)
                .subscribe(res => {
                    this.modalData = {
                        action: action,
                        title: 'Prenota il tuo allenamento!',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal(action);
                }, err => {
                    this.message = {
                        text: err.error,
                        class: 'alert-danger'
                    };
                });
        }
    }

    change(action: string, event: any) {

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
        event = event.event;
        this.modalData = {
            action: action,
            title: event.title,
            role: this.role,
            userId: this.user.id,
            event: event
        };
        console.log(event);
        this.openModal(action);
    }

    openModal(action) {
        document.getElementById(`customer-${action}-modal-button`).click();
    }

    getEvents() {
        this.events = [];
        this.getReservations();
    }

    getReservations() {
        console.log('get reservations');
        const {startDay, endDay} = this.getStartAndEndTimeByView();
        this.trainingService
            .getReservations(startDay, endDay, this.user.id)
            .subscribe(res => {
                res.forEach(val => {
                    this.events.push(this.formatEvent(val));
                });
                this.getTimesOff();
            });
    }


    getTimesOff() {
        console.log('get timesoff');
        const {startDay, endDay} = this.getStartAndEndTimeByView();
        this.timesOffService.getTimesOff(startDay, endDay, undefined, 'admin')
            .subscribe((value: Object[]) => {
                    value.map(res => {
                        this.events.push(this.formatEvent(res));
                    });
                this.refreshView();
            });
    }

}
