import {Injectable} from '@angular/core';
import {BundleService, BundleSpecsService, EventService, ReservationService, UserService} from '../controllers';
import {Observable} from 'rxjs';
import {User} from '../../shared/model';
import {AuthenticationDirective} from '../authentication';
import {DateService, GymService} from '../utilities';
import {SessionService} from '../controllers/session.service';


@Injectable()
export class CalendarFacade {

    constructor(private userService: UserService,
                private auth: AuthenticationDirective,
                private reservationService: ReservationService,
                private bundleService: BundleService,
                private specService: BundleSpecsService,
                private eventService: EventService,
                private dateService: DateService,
                private sessionService: SessionService,
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
        return this.userService.findUserById(id);
    }

    getCurrentRoleId() {
        return this.auth.getCurrentUserRoleId();
    }

    getConfig() {
        return this.gymService.getConfig();
    }

    getUsersByEventId(eventId) {
        return this.userService.getUsersByEventId(eventId);
    }

    getCurrentTrainingBundles(id): Observable<any> {
        return this.userService.getCurrentTrainingBundles(id);
    }

    /**
     * BUNDLE API
     */
    getCourses(): Observable<any> {
        return this.specService.listBundleSpecs({disabled: false, type: 'C'});
    }
    /**
     * EVENTS API
     */

    getEvents(startTime: any, endTime: any, types?: string[], customerId?: number, trainerId?: number): Observable<any> {
        const startS = CalendarFacade.formatDateToString(startTime);
        const endS = CalendarFacade.formatDateToString(endTime);
        return this.eventService.getEvents(startS, endS, types, customerId, trainerId);
    }

    createHoliday(eventName: any, start: Date, end: Date): Observable<any> {
        const gymId = this.gymService.gym.id;
        if (!end) {
            const {startTime, endTime} = this.gymService.getGymStartAndEndHour(start);
            start = startTime;
            end = endTime;
        }

        return this.eventService.createHoliday(gymId, {name: eventName, startTime: start, endTime: end});
    }

    deleteHoliday(id: any): Observable<any> {
        return this.eventService.deleteHoliday(id);
    }

    editHoliday(id: any, event: { name: any; startTime: any; endTime: any }) {
        const gymId = this.gymService.gym.id;

        return this.eventService.editHoliday(gymId, id, event);
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

    deleteTimeOff(id: number): Observable<any> {
        return this.eventService.deleteTimeOff(id);
    }

    editTimeOff(id: number, startTime: Date, endTime: Date, name: string) {
        const gymId = this.gymService.gym.id;

        return this.eventService.editTimeOff(gymId, id, {startTime: startTime, endTime: endTime, name: name});
    }


    /**
     * RESERVATION API
     */

    confirmReservation(id: number): Observable<any> {
        return this.reservationService.confirmReservation(id);
    }

    completeEvent(id: number): Observable<any> {
        return this.eventService.completeEvent(id);
    }

    deleteReservation(data: any, id?: number) {
        // TODO implement simpler logic
        const gymId = this.gymService.gym.id;
        const eventId = data.id;
        let reservations = data.reservations;

        if (!!id) {
            reservations = reservations.filter(a => a.user.id === id);
        }

        if (data.reservations.length > 0) {
            const reservationId = reservations[0].id;
            return this.reservationService.deleteReservation(data.id, reservationId, gymId);
        }

        return new Observable(observer => observer.error({error: {message: 'Nessuna prenotazione'}}));
    }

    deleteOneReservation(eventId: number, id: number): Observable<any> {
        const gymId = this.gymService.gym.id;
        return this.reservationService.deleteReservation(eventId, id, gymId);
    }

    createReservationFromBundle(userId: number, bundleId: number, event: any) {
        const gymId = this.gymService.gym.id;
        return this.reservationService.createReservationFromBundle(gymId, userId, bundleId, event);
    }

    createReservationFromEvent(userId: any, eventId: number, bundleId: number): Observable<any> {
        const gymId = this.gymService.gym.id;
        return this.reservationService.createReservationFromEvent(gymId,
            {customerId: userId, eventId: eventId, bundleId: bundleId});
    }

    isDayEvent(startTime: Date, endTime: Date) {
        return this.gymService.isDayEvent(startTime, endTime);
    }

    createCourseEvent(name: any, meta: any, start: Date, end: Date, external: boolean, maxCustomers: number) {
        const gymId = this.gymService.gym.id;
        return this.eventService.createCourseEvent(gymId, {
            name: name, id: meta,
            startTime: start, endTime: end,
            external: external,
            maxCustomers: maxCustomers
        });
    }

    deleteCourseEvent(id: any): Observable<any> {
        return this.eventService.deleteCourseEvent(id);
    }

    getRoleByUser(user: User) {
        return this.auth.getRoleByUser(user);
    }

    getUserBundleBySpecId(userId: number, specId: any): Observable<any> {
        return this.userService.getCustomerBundleBySpecId(userId, specId);
    }

    findEventById(id: number): Observable<any> {
        return this.eventService.findById(id);
    }

    findSessionById(id: any) {
        return this.sessionService.findSessionById(id);
    }
}
