import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {to_promise} from '../functions/decorators';


@Injectable()
export class StatsService {

    constructor(private http: HttpClient) {
    }

    @to_promise
    public getSalesByMonths(interval): any {
        return this.http.get('/stats/getSaleByMonth', {params: {interval: interval}});
    }

    @to_promise
    public getSalesByBundleType(interval): any {
        return this.http.get('/stats/getSaleByBundleType', {params: {interval: interval}});
    }
}
