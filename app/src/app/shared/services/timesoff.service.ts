import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class TimesOffService {

    constructor(private http: HttpClient) {}

    check(gymId: number, start: string, end: string, type: string): Observable<any> {
        return this.http.get(`/events/isAvailable?gymId=${gymId}&startTime=${start}&endTime=${end}&type=${type}`);
    }

    book(gymId: number, start: string, end: string, type: string, name: string, id: number): Observable<any> {
        return this.http.get(`/events/book/${id}?gymId=${gymId}&name=${name}&startTime=${start}&endTime=${end}&type=${type}`);
    }

    getTimesOff(start: string, end: string, id?: number, type?: string): Observable<any> {
        let endpoint = '/events?';
        if (id) { endpoint += `id=${id}&`; }
        endpoint += `startTime=${start}&`;
        endpoint += `endTime=${end}`;
        if (type) { endpoint += `&type=${type}`; }
        return this.http.get(endpoint);
    }

    delete(id: number, type?: string): Observable<any> {
        let endpoint = `/events/${id}`;
        if (type) { endpoint += `?type=${type}`; }
        return this.http.delete(endpoint);
    }

    change(gymId: number, timeOffId: any, start: string, end: string, timeOffName: string, type: string) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(`/events/change/${timeOffId}/?gymId=${gymId}&startTime=${start}&endTime=${end}&name=${timeOffName}&type=${type}`);
    }

    checkChange(gymId: number, start: string, end: string, type: string) {
        return this.http.get(`/events/checkChange?gymId=${gymId}&startTime=${start}&endTime=${end}&type=${type}`);
    }

    getAllEvents(start: string, end: string): Observable<any> {
        return this.http.get(`/events?startTime=${start}&endTime=${end}`);
    }
}
