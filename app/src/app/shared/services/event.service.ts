import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class EventService {

    constructor(private http: HttpClient) {}

    getTimesOff(start: string, end: string, id: number): Observable<any> {
        return this.http.get(`/events/timeOff?trainerId=${id}&startTime=${start}&endTime=${end}`);
    }

    deleteTimeOff(id: number): Observable<any> {
        const endpoint = `/events/timeOff/${id}`;
        return this.http.delete(endpoint);
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

    createCourseEvent(gymId: any, event: { name: any; startTime: Date; id: any; endTime: Date }) {
        return this.http.post(`/events/${gymId}/course`, event);
    }

    deleteCourseEvent(id: any) {
        return this.http.delete(`/events/course/${id}`);
    }

    getCourseEvents(start: string, end: string): Observable<any> {
        return this.http.get(`/events/course?startTime=${start}&endTime=${end}`);
    }

    getCustomerEvents(id: any, start: string, end: string): Observable<any> {
        return this.http.get(`/events/personal?customerId=${id}&startTime=${start}&endTime=${end}`);
    }

    getTrainingEvents(start: string, end: string): Observable<any> {
        return this.http.get(`/events/training?&startTime=${start}&endTime=${end}`);
    }

    complete(id: number): Observable<any> {
        return this.http.get(`/events/${id}/complete`);
    }
}
