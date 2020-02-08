import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {to_promise} from '../functions/decorators';
import {AuthenticationService} from '../authentication';

@Injectable({
    providedIn: 'root'
})
export class GymService {

    R_DAY_OF_WEEK = {
        0 : 'sunday',
        1 : 'monday',
        2 : 'tuesday',
        3 : 'wednesday',
        4 : 'thursday',
        5 : 'friday',
        6 : 'saturday'
    };

    gym: any;

    constructor(private http: HttpClient,
                private auth: AuthenticationService) {}

    private getDay(date: Date) {
        return this.R_DAY_OF_WEEK[date.getDay()];
    }

    getGymStartAndEndHour(date) {
        // TODO: add comments here
        const dayS = this.getDay(date);
        const startTime = date;
        const endTime = new Date(date);
        startTime.setHours(startTime.getHours() + this.gym[dayS + 'StartHour']);
        endTime.setHours(endTime.getHours() + this.gym[dayS + 'EndHour']);
        return {startTime, endTime};
    }

    @to_promise
    getConfig(): any {
        return this.http.get(`/gyms`).pipe(map((res: Object) => this.gym = res[0]));
    }

    patch(gym: any) {
        return this.http.patch(`/gyms/${gym.id}`, gym);
    }

    isGymOpenOnDate(date: Date) {
        const dayS = this.getDay(date);
        return this.gym[dayS + 'Open'];
    }

    getStartHourByDate(start: Date) {
        const dayS = this.getDay(start);
        return this.gym[dayS + 'StartHour'];
    }

    getEndHourByDate(end: Date) {
        const dayS = this.getDay(end);
        return this.gym[dayS + 'EndHour'];
    }

    canEdit() {
        return this.auth.getUserRole() === 1;
    }

    isDayEvent(start: Date, end: Date) {
        const startHour = this.getStartHourByDate(start);
        const endHour = this.getEndHourByDate(end);
        const dayDuration = endHour - startHour;
        const eventDuration = dayDuration * (end.getDate() - start.getDate()) + (end.getHours() - start.getHours());
        console.log(dayDuration, eventDuration);
        return dayDuration === eventDuration;
    }
}
