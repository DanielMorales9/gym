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
                private timesOffService: TimesOffService,
                private dateService: DateService,
                private gymService: GymService) {
    }

    getUser() {
        return this.appService.user;
    }

    getRole() {
        return this.appService.currentRole;
    }

    getConfig() {
        return this.gymService.getConfig(this.getUser().id);
    }

    bookTimeOff(start: Date, name: string, type: string, userId: number, end?: Date) {
        if (!end) {
            const {startTime, endTime} = this.gymService.getStartAndEndTimeByGymConfiguration(start);
            start = startTime;
            end = endTime;
        }
        return this.timesOffService.book(start, end, type, name, userId);
    }

    checkDayTimeOff(date: any, type: string) {
        const {startTime, endTime} = this.gymService.getStartAndEndTimeByGymConfiguration(new Date(date));
        return this.timesOffService.check(startTime, endTime, type);
    }

    checkHourTimeOff(date: any, type: string) {
        const startTime = new Date(date);
        const endTime = this.dateService.addHour(startTime);

        return this.timesOffService.check(startTime, endTime, type);
    }

    getReservations(startDay: any, endDay: any, userId?: number): Observable<Object[]> {
        return this.trainingService.getReservations(startDay, endDay, userId);
    }

    getTimesOff(startDay: any, endDay: any, id: number, type?: string): Observable<Object[]> {
        return this.timesOffService.getTimesOff(startDay,  endDay, id, type);
    }

    confirmReservation(eventId: any) {
        return this.trainingService.confirm(eventId);
    }

    completeReservation(id: number) {
        return this.trainingService.complete(id);
    }

    deleteTimeOff(id: number, type?: string) {
        return this.timesOffService.delete(id, type);
    }

    deleteReservation(id: any, type?: string) {
        return this.trainingService.delete(id, type);
    }

    checkTimeOffChange(newStart: Date, newEnd: Date, type: string) {
        return this.timesOffService.checkChange(newStart, newEnd, type);
    }

    changeTimeOff(id: number, start: Date, end: Date, name: string | any, type: string) {
        return this.timesOffService.change(id, start, end, name, type);
    }

    checkReservation(date: Date, id: number) {
        return this.trainingService.check(date, id);
    }

    bookReservation(date: Date, userId: number) {
        return this.trainingService.book(date, userId);
    }
}
