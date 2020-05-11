import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {to_promise} from '../functions/decorators';
import {Observable} from 'rxjs';


@Injectable()
export class StatsService {

    constructor(private http: HttpClient) {
    }

    public getSalesByMonths(interval): Observable<any> {
        return this.http.get('/stats/getSaleByMonth', {params: {interval: interval}});
    }

    public getSalesByBundleType(interval): Observable<any> {
        return this.http.get('/stats/getSaleByBundleType', {params: {interval: interval}});
    }

    public getReservationsByWeek(interval: any): Observable<any> {
        return this.http.get('/stats/getReservationsByWeek', {params: {interval: interval}});
    }

    public getReservationsByDayOfWeek(interval: any): Observable<any> {
        return this.http.get('/stats/getReservationsByDayOfWeek', {params: {interval: interval}});
    }

    public getCustomerReservationsByWeek(id: any, interval: any): Observable<any> {
        return this.http.get('/stats/getCustomerReservationsByWeek',
            {params: {interval: interval, id: id}});
    }
}
