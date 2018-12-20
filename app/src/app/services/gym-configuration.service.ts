import { Injectable } from '@angular/core'
import {
    DAYS_OF_WEEK
} from "angular-calendar";

@Injectable({
    providedIn: 'root'
})
export class GymConfigurationService {

    public dayStartHour: number = 8;
    public dayEndHour: number = 22;
    public excludeDays: number[] = [0, 6];
    public weekStartsOn = DAYS_OF_WEEK.MONDAY;

    constructor() {}

    getStartAndEndTimeByGymConfiguration(date) {
        let startTime = date;
        let endTime = new Date(date);
        startTime.setHours(startTime.getHours() + this.dayStartHour);
        endTime.setHours(endTime.getHours() + this.dayEndHour);
        return {startTime, endTime};
    }
}