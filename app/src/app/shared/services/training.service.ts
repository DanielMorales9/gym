import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class TrainingService {

    constructor(private http: HttpClient) {}

    check(gymId: number, date: string, id: number): Observable<any> {
        return this.http.get(`/reservations/checkAvailabilityAndEnablement?gymId=${gymId}&date=${date}&id=${id}`);
    }

    book(gymId: number, date: string, id: number): Observable<any> {
        return this.http.get(`/reservations/book/${id}?gymId=${gymId}&date=${date}`);
    }

    getReservations(startTime: string, endTime: string, id?: number): Observable<any> {
        let endpoint = '/reservations?';
        if (id) {
            endpoint += `id=${id}&`;
        }
        endpoint += `startTime=${startTime}&`;
        endpoint += `endTime=${endTime}`;
        return this.http.get(endpoint);
    }

    delete(id: number, type?: string) {
        let endpoint = `/reservations/${id}`;
        if (type) {
            endpoint += `?type=${type}`;
        }
        return this.http.delete(endpoint);
    }

    confirm(id: number): Observable<any> {
        return this.http.get(`/reservations/confirm/${id}`);
    }

    complete(id: number): Observable<any> {
        return this.http.get(`/reservations/complete/${id}`);
    }
}
