import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

    constructor() {}

    public getStringDate(d) {
        const currentDate = new Date(d);
        return currentDate.getDate() + '/'
            + (currentDate.getMonth() + 1)  + '/'
            + currentDate.getFullYear() + ', '
            + currentDate.getHours() + ':'
            + currentDate.getMinutes();

    }

    public addHour(startTime: Date) {
       const endTime = new Date(startTime);
       endTime.setHours(endTime.getHours() + 1);
       return endTime;
    }
}
