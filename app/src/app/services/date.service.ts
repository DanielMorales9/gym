import { Injectable } from '@angular/core'

@Injectable()
export class DateService {

    constructor() {}

    public getDate(d) {
        let currentdate = new Date(d);
        return currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();

    }

    public addHour(startTime: Date) {
       let endTime = new Date(startTime);
       endTime.setHours(endTime.getHours()+1);
       return endTime;
    }
}