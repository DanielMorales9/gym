import {Injectable} from '@angular/core';
import {EventService, TrainingService, UserService} from '../shared/services';
import {AppService} from './app.service';
import {GymService} from './gym.service';
import {DateService} from './date.service';
import {Observable} from 'rxjs';


@Injectable()
export class CalendarFacade {

    constructor(private userService: UserService,
                private appService: AppService,
                private trainingService: TrainingService,
                private eventService: EventService,
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
     * Holiday API
     */

    isHolidayAvailable(date: any) {
        const gymId = this.gymService.gym.id;
        const startTime = new Date(date);
        const endTime = this.dateService.addHour(startTime);

        return this.eventService.isHolidayAvailable(gymId, {startTime: startTime, endTime: endTime});
    }

    isHolidayAvailableAllDay(date: any) {
        const gymId = this.gymService.gym.id;
        const {startTime, endTime} = this.gymService.getGymStartAndEndHour(new Date(date));

        return this.eventService.isHolidayAvailable(gymId, {startTime: startTime, endTime: endTime});
    }

    createHoliday(eventName: any, start: Date, end: Date) {
        const gymId = this.gymService.gym.id;
        if (!end) {
            const {startTime, endTime} = this.gymService.getGymStartAndEndHour(start);
            start = startTime;
            end = endTime;
        }

        return this.eventService.createHoliday(gymId, {name: eventName, startTime: start, endTime: end});
    }

    deleteHoliday(id: any) {
        return this.eventService.deleteHoliday(id);
    }

    editHoliday(id: any, event: { name: any; startTime: any; endTime: any }) {
        const gymId = this.gymService.gym.id;

        return this.eventService.editHoliday(gymId, id, event);
    }

    canEditHoliday(id: any, event: { name: any; startTime: any; endTime: any }) {
        const gymId = this.gymService.gym.id;

        return this.eventService.canEditHoliday(gymId, id, event);
    }


    getHoliday(startTime: any, endTime: any): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getHolidays(startS, endS);
    }

    /**
     * TIME-OFF API
     */

    createTimeOff(trainerId: number, name: string, start: Date, end?: Date) {
        const gymId = this.gymService.gym.id;
        if (!end) {
            const {startTime, endTime} = this.gymService.getGymStartAndEndHour(start);
            start = startTime;
            end = endTime;
        }

        return this.eventService.createTimeOff(gymId, trainerId, {startTime: start, endTime: end, name: name});
    }

    isTimeOffAvailable(date: any) {
        const gymId = this.gymService.gym.id;
        const startTime = new Date(date);
        const endTime = this.dateService.addHour(startTime);

        return this.eventService.isTimeOffAvailable(gymId, {startTime: startTime, endTime: endTime});
    }

    isTimeOffAvailableAllDay(date: Date) {
        const gymId = this.gymService.gym.id;
        const {startTime, endTime} = this.gymService.getGymStartAndEndHour(new Date(date));

        return this.eventService.isTimeOffAvailable(gymId, {startTime: startTime, endTime: endTime});
    }

    getTimesOff(startTime: any, endTime: any, id: number): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getTimesOff(startS,  endS, id);
    }

    deleteTimeOff(id: number, type?: string) {
        return this.eventService.deleteTimeOff(id);
    }

    editTimeOff(id: number, startTime: Date, endTime: Date, name: string) {
        const gymId = this.gymService.gym.id;

        return this.eventService.editTimeOff(gymId, id, {startTime: startTime, endTime: endTime, name: name});
    }

    canEditTimeOff(id: any, startTime: any, endTime: any ) {
        const gymId = this.gymService.gym.id;
        return this.eventService.canEditTimeOff(gymId, id, {startTime: startTime, endTime: endTime});
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

    createReservation(userId: number, bundleId: number, event: any) {
        const gymId = this.gymService.gym.id;
        return this.trainingService.createReservation(gymId, userId, bundleId, event);
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
