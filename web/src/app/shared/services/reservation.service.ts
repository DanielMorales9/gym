import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class ReservationService {

    constructor(private http: HttpClient) {}

    createReservationFromBundle(gymId: number, userId: number, bundleId: number, event: any): Observable<any> {
        return this.http.post(`/reservations/${gymId}?customerId=${userId}&bundleId=${bundleId}`, event);
    }

    createReservationFromEvent(gymId: number, userId: number, eventId: number): Observable<any> {
        return this.http.get(`/reservations/${gymId}?customerId=${userId}&eventId=${eventId}`);
    }

    delete(eventId: number, reservationId: number, type?: string) {
        let endpoint = `/reservations/${reservationId}`;
        endpoint += `?eventId=${eventId}`;
        if (type) {
            endpoint += `&type=${type}`;
        }
        return this.http.delete(endpoint);
    }

    confirm(id: number): Observable<any> {
        return this.http.get(`/reservations/${id}/confirm`);
    }

}
