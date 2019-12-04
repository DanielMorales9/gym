import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppService} from './app.service';

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
                private app: AppService) {}

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

    getConfig(id?: number) {
        if (!id) { id = this.app.user.id; }
        return this.http.get(`/users/${id}/gym`).pipe(map((res: Object) => this.gym = res));
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
        return this.app.currentRole === 1;
    }

    isDayEvent(start: Date, end: Date) {
        const startHour = this.getStartHourByDate(start);
        const endHour = this.getEndHourByDate(end);
        const dayDuration = endHour - startHour;
        const eventDuration = end.getHours() - start.getHours();
        return dayDuration === eventDuration;
    }
}
