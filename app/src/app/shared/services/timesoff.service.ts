import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class TimesOffService {

    constructor(private http: HttpClient) {}

    private static getDateString(date: Date) {
        return date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-'
            + date.getUTCFullYear() + '_' +
            date.getUTCHours() + ':' + date.getUTCMinutes();
    }

    check(startTime: Date, endTime: Date, type: string): Observable<any> {
        const startTimeString = TimesOffService.getDateString(startTime);
        const endTimeString = TimesOffService.getDateString(endTime);
        return this.http.get(`/timesOff/checkAvailabilityAndEnablement?startTime=${startTimeString}&endTime=${endTimeString}&type=${type}`);
    }

    book(startTime: Date, endTime: Date, type: string, name: string, id: number): Observable<any> {
        const startTimeString = TimesOffService.getDateString(startTime);
        const endTimeString = TimesOffService.getDateString(endTime);
        return this.http.get(`/timesOff/book/${id}?name=${name}&startTime=${startTimeString}&endTime=${endTimeString}&type=${type}`);
    }

    getTimesOff(startDay: Date, endDay: Date, id?: number, type?: string): Observable<any> {
        let endpoint = '/timesOff?';
        if (id) {
            endpoint += `id=${id}&`;
        }
        endpoint += `startTime=${TimesOffService.getDateString(startDay)}&`;
        endpoint += `endTime=${TimesOffService.getDateString(endDay)}`;
        if (type) {
            endpoint += `&type=${type}`;
        }
        return this.http.get(endpoint);
    }

    delete(id: number, type?: string): Observable<any> {
        let endpoint = `/timesOff/${id}`;
        if (type) {
            endpoint += `&type=${type}`;
        }
        return this.http.delete(endpoint);
    }

    change(timeOffId: any, startTime: Date, endTime: Date, timeOffName: string, type: string) {
        const start = TimesOffService.getDateString(startTime);
        const end = TimesOffService.getDateString(endTime);
        return this.http.get(`/timesOff/change/${timeOffId}/?startTime=${start}&endTime=${end}&name=${timeOffName}&type=${type}`);
    }

    checkChange(newStart: Date, newEnd: Date, type: string) {
        const startTimeString = TimesOffService.getDateString(newStart);
        const endTimeString = TimesOffService.getDateString(newEnd);
        return this.http.get(`/timesOff/checkChange?startTime=${startTimeString}&endTime=${endTimeString}&type=${type}`);
    }
}
