import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {Observable} from "rxjs";

@Injectable()
export class SalesService {

    constructor(private http: HttpClient) {}

    findUserSales(id: number, page: number, size: number) : Observable<Object> {
        return this.http.get(`/sales/findUserSales?id=${id}&page=${page}&size=${size}&sort=createdAt,desc`);
    }

    get(page: number, size: number) : Observable<Object> {
        return this.http.get(`/sales?page=${page}&size=${size}&sort=createdAt,desc`);
    }

    createNewSale(email: string, id: number) : Observable<Object> {
        return this.http.get(`sales/createNewSale/${email}/${id}`);
    }

    delete(id: number) : Observable<Object> {
        return this.http.delete(`/sales/${id}`);
    }

    addSalesLineItem(saleId: number, bundleId: number) : Observable<Object> {
        return this.http.get(`/sales/addSalesLineItem/${saleId}/${bundleId}`);
    }

    deleteSalesLineItem(saleId: number, salesLineItemId: number) : Observable<Object> {
        return this.http.delete(`/sales/deleteSalesLineItem/${saleId}/${salesLineItemId}`);
    }

    confirmSale(id: number) : Observable<Object> {
        return this.http.get(`/sales/confirmSale/${id}`);
    }

    findById(saleId: number) : Observable<Object> {
        return this.http.get(`/sales/${saleId}`);
    }

    getEndpoint(endpoint: string) : Observable<Object> {
        return this.http.get(endpoint);
    }

    pay(id: number, amount: number) : Observable<Object> {
        return this.http.post(`/sales/pay/${id}`, amount);
    }

    searchByLastName(query: string, page: number, size: number) : Observable<Object> {
        return this.http.get(`/sales/searchByLastName?lastName=${query}&page=${page}&size=${size}&sort=createdAt,desc`);
    }

    searchByDate(query: string, id: number, page: number, size: number) : Observable<Object> {
        return this.http.get(`/sales/searchByDate?id=${id}&date=${query}&page=${page}&size=${size}&sort=createdAt,asc`);
    }
}