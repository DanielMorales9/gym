import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class EventService {

    constructor(private http: HttpClient) {}

    deleteTimeOff(id: number): Observable<any> {
        const endpoint = `/events/timeOff/${id}`;
        return this.http.delete(endpoint);
    }

    createHoliday(gymId: any, event: { name: string; startTime: Date; endTime: Date }): Observable<any> {
        return this.http.post(`/events/${gymId}/holiday`, event);
    }

    createTimeOff(gymId: any, trainerId, event: { name: string; startTime: Date; endTime: Date }) {
        return this.http.post(`/events/${gymId}/timeOff?trainerId=${trainerId}`, event);
    }

    deleteHoliday(id: number): Observable<any> {
        return this.http.delete(`/events/holiday/${id}`);
    }

    editHoliday(gymId: number, id: any, event: { name: string; startTime: Date; endTime: Date }): Observable<any> {
        return this.http.patch(`/events/${gymId}/holiday/${id}`, event);
    }

    editTimeOff(gymId: any, id: number, event: { name: string; startTime: Date; endTime: Date }) {
        return this.http.patch(`/events/${gymId}/timeOff/${id}`, event);
    }

    createCourseEvent(gymId: any, event: {
        name: any; startTime: Date; id: any; endTime: Date,
        external: boolean, maxCustomers: number }) {

        return this.http.post(`/events/${gymId}/course`, event);
    }

    deleteCourseEvent(id: any): Observable<any> {
        return this.http.delete(`/events/course/${id}`);
    }

    completeEvent(id: number): Observable<any> {
        return this.http.get(`/events/${id}/complete`);
    }

    findById(id: number): Observable<any> {
        return this.http.get(`/events/${id}`);
    }

    getEvents(start: string, end: string, types?: string[], customerId?: number, trainerId?: number): Observable<any> {
        const params = {
            startTime: start,
            endTime: end,
            types: types
        };

        if (!!customerId) {
            params['customerId'] = customerId.toString();
        }

        if (!!trainerId) {
            params['trainerId'] = trainerId.toString();
        }

        return this.http.get('/events', { params: params});
    }
}
