import {Injectable} from '@angular/core';
import {BundleService, BundleSpecsService, EventService, ReservationService, UserService} from '../controllers';
import {Observable, of} from 'rxjs';
import {User} from '../../shared/model';
import {AuthenticationService} from '../authentication';
import {DateService, GymService} from '../utilities';
import {to_promise} from '../functions/decorators';


@Injectable()
export class CalendarFacade {

    constructor(private userService: UserService,
                private auth: AuthenticationService,
                private reservationService: ReservationService,
                private bundleService: BundleService,
                private specService: BundleSpecsService,
                private eventService: EventService,
                private dateService: DateService,
                private gymService: GymService) {
    }

    static formatDateToString(date: Date) {
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
        return this.auth.getUser();
    }

    findUserById(id: number) {
        return this.userService.findById(id);
    }

    getRole() {
        return this.auth.getCurrentUserRole();
    }

    getConfig() {
        return this.gymService.getConfig();
    }

    getUsersByEventId(eventId) {
        return this.userService.getUsersByEventId(eventId);
    }

    getCurrentTrainingBundles(id) {
        return this.userService.getCurrentTrainingBundles(id);
    }

    /**
     * BUNDLE API
     */
    getCourses() {
        return this.specService.list({disabled: false, type: 'C'});
    }


    getCustomerEvents(id: number, startTime: any, endTime: any) {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getCustomerEvents(id, startS, endS);
    }

    /**
     * EVENTS API
     */

    getAllEvents(startTime: any, endTime: any) {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getAllEvents(startS, endS);
    }

    getCourseEvents(startTime: any, endTime: any) {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getCourseEvents(startS, endS);
    }

    getTrainingEvents(startTime: any, endTime: any) {
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


    getHoliday(startTime: any, endTime: any): any {
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

    isTimeOffAvailableAllDay(date: Date) {
        const gymId = this.gymService.gym.id;
        const {startTime, endTime} = this.gymService.getGymStartAndEndHour(new Date(date));

        return this.eventService.isTimeOffAvailable(gymId, {startTime: startTime, endTime: endTime});
    }

    getTimesOff(startTime: any, endTime: any, id: number) {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getTimesOff(startS,  endS, id);
    }

    deleteTimeOff(id: number) {
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

    deleteReservation(data: any, id?: number) {
        // TODO implement simpler logic
        const gymId = this.gymService.gym.id;
        if ('reservation' in data) {
            return this.reservationService.delete(data.id, data.reservation.id, gymId);
        }
        else if ('reservations' in data && !!id) {
            const myReservations = data.reservations.filter(a => a.user.id === id);
            if (myReservations.length > 0) {
                return this.reservationService.delete(data.id, myReservations[0].id, gymId);
            }
        }
        return new Observable(observer => observer.error({error: {message: 'Nessuna prenotazione'}}));
    }

    @to_promise
    deleteOneReservation(eventId: number, id: number): any {
        const gymId = this.gymService.gym.id;
        return this.reservationService.delete(eventId, id, gymId);
    }

    createReservationFromBundle(userId: number, bundleId: number, event: any) {
        const gymId = this.gymService.gym.id;
        return this.reservationService.createReservationFromBundle(gymId, userId, bundleId, event);
    }

    createReservationFromEvent(userId: any, eventId: number, bundleId: number) {
        const gymId = this.gymService.gym.id;
        return this.reservationService.createReservationFromEvent(gymId,
            {customerId: userId, eventId: eventId, bundleId: bundleId});
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

    getRoleByUser(user: User) {
        return this.auth.getRoleByUser(user);
    }

    getUserBundleBySpecId(userId: number, specId: any) {
        return this.userService.getBundleBySpecId(userId, specId);
    }

    findEventById(id: number) {
        return this.eventService.findById(id);
    }
}
