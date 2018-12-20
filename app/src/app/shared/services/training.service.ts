import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from "rxjs";

@Injectable()
export class TrainingService {

    constructor(private http: HttpClient) {}

    check(date: Date, id: number) : Observable<any> {
        let dateString = TrainingService.getDateString(date);
        return this.http.get(`/reservations/checkAvailabilityAndEnablement?date=${dateString}&id=${id}`);
    }


    private static getDateString(date: Date) {
        return date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-"
            + date.getUTCFullYear() + "_" + date.getUTCHours() + ":" + date.getUTCMinutes();
    }

    book(date: Date, id: number) : Observable<any> {
        let dateString = TrainingService.getDateString(date);
        return this.http.get(`/reservations/book/${id}?date=${dateString}`);
    }

    getReservations(startDay: Date, endDay: Date, id?: number) : Observable<any> {
        let endpoint = "/reservations?";
        if (id)
            endpoint += `id=${id}&`;
        endpoint += `startDay=${TrainingService.getDateString(startDay)}&`;
        endpoint += `endDay=${TrainingService.getDateString(endDay)}`;
        return this.http.get(endpoint);
    }

    delete(id: number) {
        return this.http.delete(`/reservations/${id}`);
    }

    confirm(id: number) : Observable<any> {
        return this.http.get(`/reservations/confirm/${id}`);
    }

    complete(id: number) : Observable<any> {
        return this.http.get(`/reservations/complete/${id}`);
    }
}