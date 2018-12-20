import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from "rxjs";

@Injectable()
export class TimesOffService {

    constructor(private http: HttpClient) {}

    check(startTime: Date, endTime: Date, type: string, id: number) : Observable<any> {
        let startTimeString = TimesOffService.getDateString(startTime);
        let endTimeString = TimesOffService.getDateString(endTime);
        return this.http.get(`/timesOff/checkAvailabilityAndEnablement?startTime=${startTimeString}&endTime=${endTimeString}&type=${type}`)
    }

    book(startTime: Date, endTime: Date, type: string, name: string, id: number) : Observable<any> {
        let startTimeString = TimesOffService.getDateString(startTime);
        let endTimeString = TimesOffService.getDateString(endTime);
        return this.http.get(`/timesOff/book/${id}?name=${name}&startTime=${startTimeString}&endTime=${endTimeString}&type=${type}`);
    }

    private static getDateString(date: Date) {
        return date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-"
            + date.getUTCFullYear() + "_" +
            date.getUTCHours() + ":" + date.getUTCMinutes();
    }

    getTimesOff(startDay: Date, endDay: Date, id?: number, type?: string) {
        let endpoint = "/timesOff?";
        if (id)
            endpoint += `id=${id}&`;
        endpoint += `startTime=${TimesOffService.getDateString(startDay)}&`;
        endpoint += `endTime=${TimesOffService.getDateString(endDay)}`;
        if (type)
            endpoint += `&type=${type}`;
        return this.http.get(endpoint);
    }

    delete(id: number) : Observable<any> {
        return this.http.delete(`/timesOff/${id}`);
    }

    confirm(id: any, success: (res) => void, error: (err) => void) {
        this.http.get("/timesOff/confirm/"+id).subscribe(success, error)
    }

    complete(id: any, success: (res) => void, error: (err) => void) {
        this.http.get("/reservations/onComplete/"+id).subscribe(success, error)
    }
}