import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {to_promise} from '../functions/decorators';

@Injectable()
export class SalesService {

    constructor(private http: HttpClient) {}

    get(page: number, size: number, query?: any): Observable<Object> {
        if (!query) {
            query = {};
        }
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,desc';
        return this.http.get('/sales', {params: query});
    }

    createSale(customerId: number) {
        return this.http.post(`/sales?customerId=${customerId}`, {});
    }

    delete(id: number): any {
        return this.http.delete(`/sales/${id}`);
    }

    addSalesLineItem(saleId: number, params?: any) {
        return this.http.put(`/sales/${saleId}/salesLineItems`, {}, {params: params});
    }


    deleteSalesLineItem(saleId: number, salesLineItemId: number) {
        return this.http.delete(`/sales/${saleId}/salesLineItems/${salesLineItemId}`);
    }

    confirmSale(id: number): Observable<Object> {
        return this.http.get(`/sales/${id}/confirm`);
    }

    findById(saleId: number): Observable<Object> {
        return this.http.get(`/sales/${saleId}`);
    }

    pay(id: number, amount: number): Observable<Object> {
        return this.http.get(`/sales/${id}/pay?amount=${amount}`);
    }

    findByCustomer(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,asc';

        return this.http.get('/sales/findByCustomer', {params: query});
    }

    search(query: any, page: number, size: number) {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = 'createdAt,asc';

        return this.http.get('/sales/search', {params: query});
    }

    @to_promise
    deletePayment(saleId: number, paymentId: number): any {
        return this.http.delete(`/sales/${saleId}/payments/${paymentId}`);
    }
}
