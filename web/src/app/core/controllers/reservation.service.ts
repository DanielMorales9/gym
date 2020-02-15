import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {to_promise} from '../functions/decorators';

@Injectable()
export class ReservationService {

    constructor(private http: HttpClient) {}

    createReservationFromBundle(gymId: number, userId: number, bundleId: number, event: any): Observable<any> {
        return this.http.post(`/reservations/${gymId}?customerId=${userId}&bundleId=${bundleId}`, event);
    }

    @to_promise
    createReservationFromEvent(gymId: number, params): any {
        return this.http.get(`/reservations/${gymId}`,
            {params: params});
    }

    delete(eventId: number, reservationId: number) {
        const endpoint = `/reservations/${reservationId}`;
        return this.http.delete(endpoint, { params: { eventId: eventId.toString() }});
    }

    @to_promise
    confirm(id: number): any {
        return this.http.get(`/reservations/${id}/confirm`);
    }

}
