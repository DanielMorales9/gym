import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class TrainingService {

    constructor(private http: HttpClient) {}

    createReservation(gymId: number, userId: number, bundleId: number, event: any): Observable<any> {
        return this.http.post(`/reservations/${gymId}?customerId=${userId}&bundleId=${bundleId}`, event);
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
        return this.http.get(`/reservations/${id}/confirm`);
    }

    complete(id: number): Observable<any> {
        return this.http.get(`/reservations/${id}/complete`);
    }
}
