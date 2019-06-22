import {Injectable} from '@angular/core';
import {TimesOffService, TrainingService, UserService} from '../shared/services';
import {AppService} from './app.service';
import {GymService} from './gym.service';
import {DateService} from './date.service';
import {Observable} from 'rxjs';


@Injectable()
export class CalendarFacade {

    constructor(private userService: UserService,
                private appService: AppService,
                private trainingService: TrainingService,
                private eventService: TimesOffService,
                private dateService: DateService,
                private gymService: GymService) {
    }

    private static formatDateToString(date: Date) {
        const dateValue = date.getUTCDate();
        const monthValue = date.getUTCMonth() + 1;
        const yearValue = date.getUTCFullYear();
        const hoursValue = date.getUTCHours();
        const minutesValue = date.getUTCMinutes();
        return `${dateValue}-${monthValue}-${yearValue}_${hoursValue}:${minutesValue}`;
    }

    /**
     *  USER API
     */

    getUser() {
        return this.appService.user;
    }

    getRole() {
        return this.appService.currentRole;
    }

    getConfig() {
        return this.gymService.getConfig();
    }

    /**
     * EVENTS API
     */

    getAllEvents(startTime: any, endTime: any): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getAllEvents(startS, endS);
    }

    /**
     * TIME-OFF API
     */

    bookTimeOff(start: Date, name: string, type: string, userId: number, end?: Date) {
        const gymId = this.gymService.gym.id;
        if (!end) {
            const {startTime, endTime} = this.gymService.getGymStartAndEndHour(start);
            start = startTime;
            end = endTime;
        }

        const startS = CalendarFacade.formatDateToString(start);
        const endS = CalendarFacade.formatDateToString(end);

        return this.eventService.book(gymId, startS, endS, type, name, userId);
    }

    checkDayTimeOff(date: any, type: string) {

        const gymId = this.gymService.gym.id;
        const {startTime, endTime} = this.gymService.getGymStartAndEndHour(new Date(date));

        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);

        return this.eventService.check(gymId, startS, endS, type);
    }

    checkHourTimeOff(date: any, type: string) {
        const gymId = this.gymService.gym.id;
        const startTime = new Date(date);
        const endTime = this.dateService.addHour(startTime);

        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.check(gymId, startS, endS, type);
    }

    getTimesOff(startTime: any, endTime: any, id: number, type?: string): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getTimesOff(startS,  endS, id, type);
    }

    deleteTimeOff(id: number, type?: string) {
        return this.eventService.delete(id, type);
    }

    changeTimeOff(id: number, startTime: Date, endTime: Date, name: string | any, type: string) {
        const gymId = this.gymService.gym.id;
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.change(gymId, id, startS, endS, name, type);
    }

    checkTimeOffChange(startTime: Date, endTime: Date, type: string) {
        const gymId = this.gymService.gym.id;
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.checkChange(gymId, startS, endS, type);
    }


    /**
     * RESERVATION API
     */

    confirmReservation(id: number) {
        return this.trainingService.confirm(id);
    }

    completeReservation(id: number) {
        return this.trainingService.complete(id);
    }

    deleteReservation(id: any, type?: string) {
        return this.trainingService.delete(id, type);
    }

    checkReservation(date: Date, userId: number) {
        const gymId = this.gymService.gym.id;
        const startTime = CalendarFacade.formatDateToString(date);
        const end = this.dateService.addHour(date);
        const endTime = CalendarFacade.formatDateToString(end);
        return this.trainingService.isAvailable(gymId, userId, startTime, endTime);
    }

    bookReservation(date: Date, userId: number) {
        const gymId = this.gymService.gym.id;
        const startTime = CalendarFacade.formatDateToString(date);
        const end = this.dateService.addHour(date);
        const endTime = CalendarFacade.formatDateToString(end);
        return this.trainingService.book(gymId, userId, startTime, endTime);
    }

    getReservations(startTime: any, endTime: any, userId?: number): Observable<Object[]> {
        const gymId = this.gymService.gym.id;
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.trainingService.getReservations(startS, endS, userId);
    }

    /**
     * GYM API
     */
    isGymOpenOnDate(date: Date) {
        return this.gymService.isGymOpenOnDate(date);
    }

    getStartHourByDate(start: any) {
        return this.gymService.getStartHourByDate(start);
    }

    getEndHourByDate(end: any) {
        return this.gymService.getEndHourByDate(end);
    }

    isDayEvent(startTime: Date, endTime: Date) {
        return this.gymService.isDayEvent(startTime, endTime);
    }

}
