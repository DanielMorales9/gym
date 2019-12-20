import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {to_promise} from '../functions/decorators';

@Injectable()
export class EventService {

    constructor(private http: HttpClient) {}

    @to_promise
    getTimesOff(start: string, end: string, id: number): any {
        return this.http.get(`/events/timeOff?trainerId=${id}&startTime=${start}&endTime=${end}`);
    }

    @to_promise
    deleteTimeOff(id: number): any {
        const endpoint = `/events/timeOff/${id}`;
        return this.http.delete(endpoint);
    }

    @to_promise
    getAllEvents(start: string, end: string): any {
        return this.http.get(`/events?startTime=${start}&endTime=${end}`);
    }

    isTimeOffAvailable(gymId: any, event: any) {
        return this.http.post(`/events/${gymId}/timeOff/isAvailable`, event);
    }

    isHolidayAvailable(gymId: any, event: any) {
        return this.http.post(`/events/${gymId}/holiday/isAvailable`, event);
    }

    @to_promise
    createHoliday(gymId: any, event: { name: string; startTime: Date; endTime: Date }): any {
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

    canEdit(gymId: any, event: { startTime: any; endTime: any }) {
        return this.http.post(`/events/${gymId}/canEdit`, event);
    }

    @to_promise
    getHolidays(start: any, end: any): any {
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

    @to_promise
    getCourseEvents(start: string, end: string): any {
        return this.http.get(`/events/course?startTime=${start}&endTime=${end}`);
    }

    @to_promise
    getCustomerEvents(id: any, start: string, end: string): any {
        return this.http.get(`/events/personal?customerId=${id}&startTime=${start}&endTime=${end}`);
    }

    @to_promise
    getTrainingEvents(start: string, end: string): any {
        return this.http.get(`/events/training?&startTime=${start}&endTime=${end}`);
    }

    complete(id: number): Observable<any> {
        return this.http.get(`/events/${id}/complete`);
    }
}
