import {Injectable} from '@angular/core';
import {TimesOffService, TrainingService, UserService} from '../shared/services';
import {AppService} from './app.service';
import {GymConfigurationService} from './gym-configuration.service';
import {DateService} from './date.service';
import {Observable} from 'rxjs';


@Injectable()
export class CalendarFacade {

    constructor(private userService: UserService,
                private appService: AppService,
                private trainingService: TrainingService,
                private timesOffService: TimesOffService,
                private dateService: DateService,
                private gymConf: GymConfigurationService) {
    }

    getUser() {
        return this.appService.user;
    }

    getConfig() {
        return {
            'dayEndHour': this.gymConf.dayEndHour,
            'dayStartHour': this.gymConf.dayStartHour,
            'excludeDays': this.gymConf.excludeDays,
            'weekStartsOn': this.gymConf.weekStartsOn,
        };
    }

    bookTimeOff(start: Date, name: string, type: string, userId: number, end?: Date) {
        if (!end) {
            const {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(start);
            start = startTime;
            end = endTime;
        }
        return this.timesOffService.book(start, end, type, name, userId);
    }

    checkDayTimeOff(date: any, type: string) {
        const {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(date));
        return this.timesOffService.check(startTime, endTime, type);
    }

    checkHourTimeOff(date: any, type: string) {
        const startTime = new Date(date);
        const endTime = this.dateService.addHour(startTime);

        return this.timesOffService.check(startTime, endTime, type);
    }

    getReservations(startDay: any, endDay: any): Observable<Object[]> {
        return this.trainingService.getReservations(startDay, endDay);
    }

    getTimesOff(startDay: any, endDay: any, id: number, type: string): Observable<Object[]> {
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
}
