import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

    constructor() {}
    public addHour(startTime: Date) {
       const endTime = new Date(startTime);
       endTime.setHours(endTime.getHours() + 1);
       return endTime;
    }
}
