import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {to_promise} from '../functions/decorators';

@Injectable()
export class SalesService {

    constructor(private http: HttpClient) {}

    findUserSales(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,desc';
        return this.http.get('/sales/findUserSales', {params: query});
    }

    get(page: number, size: number, query?: any): Observable<Object> {
        if (!query) {
            query = {};
        }
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,desc';
        return this.http.get('/sales', {params: query});
    }

    @to_promise
    createSale(customerId: number): any {
        return this.http.get(`/sales/createSale/${customerId}`);
    }

    delete(id: number): any {
        return this.http.delete(`/sales/${id}`);
    }

    addSalesLineItem(saleId: number, bundleId: number): Observable<Object> {
        return this.http.get(`/sales/addSalesLineItem/${saleId}/${bundleId}`);
    }

    deleteSalesLineItem(saleId: number, salesLineItemId: number): Observable<Object> {
        return this.http.delete(`/sales/deleteSalesLineItem/${saleId}/${salesLineItemId}`);
    }

    confirmSale(id: number): Observable<Object> {
        return this.http.get(`/sales/confirmSale/${id}`);
    }

    findById(saleId: number): Observable<Object> {
        return this.http.get(`/sales/${saleId}`);
    }

    getEndpoint(endpoint: string): Observable<Object> {
        return this.http.get(endpoint);
    }

    pay(id: number, amount: number): Observable<Object> {
        return this.http.get(`/sales/pay/${id}?amount=${amount}`);
    }

    searchByLastName(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,desc';

        return this.http.get('/sales/searchByLastName', {params: query});
    }

    searchByDateAndId(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,asc';

        return this.http.get('/sales/searchByDateAndId', {params: query});
    }

    searchByDate(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,asc';
        return this.http.get('/sales/searchByDate', {params: query});
    }

    searchByLastNameAndDate(query: any, page: number, size: number) {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,asc';

        return this.http.get('/sales/searchByLastNameAndDate', {params: query});
    }

    addSalesLineItemByBundle(saleId: number, bundleId: number): Observable<Object> {
        return this.http.get(`/sales/addSalesLineItemByBundle/${saleId}/${bundleId}`);
    }
}
