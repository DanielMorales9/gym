import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Gym} from '../shared/model';

@Injectable({
    providedIn: 'root'
})
export class GymService {

    gym: Gym;

    constructor(private http: HttpClient) {}

    getStartAndEndTimeByGymConfiguration(date) {
        const startTime = date;
        const endTime = new Date(date);
        startTime.setHours(startTime.getHours() + this.gym.dayStartHour);
        endTime.setHours(endTime.getHours() + this.gym.dayEndHour);
        return {startTime, endTime};
    }

    getConfig(id: number) {
        return this.http.get(`/admins/${id}/gym`).pipe(map((res: Gym) => this.gym = res));
    }

    patch(gym: any) {
        return this.http.patch(`/gyms/${gym.id}`, gym);
    }
}
