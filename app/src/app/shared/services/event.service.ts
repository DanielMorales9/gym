import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class EventService {

    constructor(private http: HttpClient) {}

    check(gymId: number, start: string, end: string, type: string): Observable<any> {
        return this.http.get(`/events/isAvailable?gymId=${gymId}&startTime=${start}&endTime=${end}&type=${type}`);
    }

    book(gymId: number, start: string, end: string, type: string, name: string, id: number): Observable<any> {
        return this.http.get(`/events/book/${id}?gymId=${gymId}&name=${name}&startTime=${start}&endTime=${end}&type=${type}`);
    }

    getTimesOff(start: string, end: string, id: number): Observable<any> {
        return this.http.get(`/events/timeOff/${id}?startTime=${start}&endTime=${end}`);
    }

    deleteTimeOff(id: number): Observable<any> {
        const endpoint = `/events/timeOff/${id}`;
        return this.http.delete(endpoint);
    }

    change(gymId: number, timeOffId: any, start: string, end: string, timeOffName: string, type: string) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(`/events/change/${timeOffId}/?gymId=${gymId}&startTime=${start}&endTime=${end}&name=${timeOffName}&type=${type}`);
    }

    canEditTimeOff(gymId: number, id: number, event: any) {
        return this.http.post(`/events/${gymId}/timeOff/${id}/canEdit`, event);
    }

    getAllEvents(start: string, end: string): Observable<any> {
        return this.http.get(`/events?startTime=${start}&endTime=${end}`);
    }

    isTimeOffAvailable(gymId: any, event: any) {
        return this.http.post(`/events/${gymId}/timeOff/isAvailable`, event);
    }

    isHolidayAvailable(gymId: any, event: any) {
        return this.http.post(`/events/${gymId}/holiday/isAvailable`, event);
    }

    createHoliday(gymId: any, event: { name: string; startTime: Date; endTime: Date }) {
        return this.http.post(`/events/${gymId}/holiday`, event);
    }

    createTimeOff(gymId: any, trainerId, event: { name: string; startTime: Date; endTime: Date }) {
        return this.http.post(`/events/${gymId}/timeOff?trainerId=${trainerId}`, event);
    }

    deleteHoliday(id: number) {
        return this.http.delete(`/events/holiday/${id}`);
    }

    editHoliday(gymId: number, id: any, event: { name: string; startTime: Date; endTime: Date }) {
        return this.http.patch(`/events/${gymId}/holiday/${id}`, event);
    }

    canEditHoliday(gymId: any, id: any, event: { name: any; startTime: any; endTime: any }) {
        return this.http.post(`/events/${gymId}/holiday/${id}/canEdit`, event);
    }

    getHolidays(start: any, end: any): Observable<any> {
        return this.http.get(`/events/holiday?startTime=${start}&endTime=${end}`);
    }

    editTimeOff(gymId: any, id: number, event: { name: string; startTime: Date; endTime: Date }) {
        return this.http.patch(`/events/${gymId}/timeOff/${id}`, event);
    }
}
