import {Injectable} from '@angular/core';
import {EventService, ReservationService, UserService} from '../shared/services';
import {AppService} from './app.service';
import {GymService} from './gym.service';
import {DateService} from './date.service';
import {Observable} from 'rxjs';
import {BundleService} from './bundle.service';


@Injectable()
export class CalendarFacade {

    constructor(private userService: UserService,
                private appService: AppService,
                private reservationService: ReservationService,
                private bundleService: BundleService,
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
     * BUNDLE API
     */
    getCourses(startTime: Date, endTime?: Date): Observable<Object[]> {
        if (!endTime) {
            endTime = this.dateService.addHour(startTime);
        }
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.bundleService.getCourses(startS, endS);
    }


    getCustomerEvents(startTime: any, endTime: any): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getCustomerEvents(this.getUser().id, startS, endS);
    }

    /**
     * EVENTS API
     */

    getAllEvents(startTime: any, endTime: any): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getAllEvents(startS, endS);
    }

    getCourseEvents(startTime: any, endTime: any): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getCourseEvents(startS, endS);
    }

    getTrainingEvents(startTime: any, endTime: any): Observable<Object[]> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getTrainingEvents(startS, endS);
    }

    /**
     * Holiday API
     */
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

    canEdit(event: { startTime: any; endTime: any }) {
        const gymId = this.gymService.gym.id;

        return this.eventService.canEdit(gymId, event);
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


    /**
     * RESERVATION API
     */

    confirmReservation(id: number) {
        return this.reservationService.confirm(id);
    }

    completeEvent(id: number) {
        return this.eventService.complete(id);
    }

    deleteReservation(data: any, type?: string) {
        // TODO fix the reservations and events deletion
        if ('reservation' in data) {
            if (data.reservation.user.id === this.getUser().id) {
                return this.reservationService.delete(data.id, data.reservation.id, type);
            }
        }
        else if ('reservations' in data) {
            const myReservations = data.reservations.filter(a => a.user.id === this.getUser().id);
            if (myReservations.length > 0) {
                return this.reservationService.delete(data.id, myReservations[0].id, type);
            }
        }
        return new Observable(observer => observer.error({error: {message: 'Nessuna prenotazione'}}));
    }

    createReservationFromBundle(userId: number, bundleId: number, event: any) {
        const gymId = this.gymService.gym.id;
        return this.reservationService.createReservationFromBundle(gymId, userId, bundleId, event);
    }

    createReservationFromEvent(userId: number, eventId: number) {
        const gymId = this.gymService.gym.id;
        return this.reservationService.createReservationFromEvent(gymId, userId, eventId);
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

    createCourseEvent(name: any, meta: any, start: Date, end: Date) {
        const gymId = this.gymService.gym.id;
        return this.eventService.createCourseEvent(gymId, {name: name, id: meta, startTime: start, endTime: end});
    }

    deleteCourseEvent(id: any) {
        return this.eventService.deleteCourseEvent(id);
    }
}
