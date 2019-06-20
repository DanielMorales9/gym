import {Injectable} from '@angular/core';
import {Sale} from '../model';
import {SalesService} from './sales.service';
import {HelperService} from './helper.service';
import {Observable} from 'rxjs';

@Injectable()
export class SaleHelperService extends HelperService<Sale> {

    constructor(private service: SalesService) {
        super();
    }

    static unwrapLines(sale: Sale) {
        if (sale.salesLineItems) {
            if (sale.salesLineItems['_embedded']) {
                sale.salesLineItems = sale.salesLineItems['_embedded']['salesLineItemResources'];
            }
        }
    }

    static extractSalesLineItem(sale: Sale) {
        if (!sale.salesLineItems) {
            sale.salesLineItems = [];
        } else {
            sale.salesLineItems = sale.salesLineItems['_embedded']['salesLineItemResources'];
        }
        return sale;
    }

    createSale(email: string, id: number) {
        return this.service.createSale(email, id);
    }

    delete(id: number) {
        return this.service.delete(id);
    }

    addSalesLineItem(saleId: number, bundleId: any) {
        return this.service.addSalesLineItem(saleId, bundleId);
    }

    deleteSalesLineItem(saleId: number, adminId: any) {
        return this.service.deleteSalesLineItem(saleId, adminId);
    }

    confirmSale(id: number) {
        return this.service.confirmSale(id);
    }

    findById(saleId: number) {
        return this.service.findById(saleId);
    }

    get(page: number, size: number): Observable<Object> {
        return this.service.get(page, size);
    }

    search(query: any, page: number, size: number): Observable<Object> {
        let observable, date, value;
        if (!!query.date) {
            date = new Date(query.date);
            value = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
        }
        if (!!query.id && value) {
            observable = this.service.searchByDateAndId(value, query.id, page, size);
        } else if (!!query.id) {
            observable = this.service.findUserSales(query.id, page, size);
        } else if (!!query.lastName && value) {
            observable = this.service.searchByLastNameAndDate(query.lastName, value, page, size);
        } else if (!!query.lastName) {
            observable = this.service.searchByLastName(query.lastName, page, size);
        } else if (value) {
            observable = this.service.searchByDate(value, page, size);
        }

        return observable;
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        let observable;
        if (query === undefined || Object.keys(query).length === 0) {
            observable = this.get(page, size);
        } else {
            observable = this.search(query, page, size);
        }
        return observable;
    }

    preProcessResources(resources: Sale[]): Sale[] {
        resources = this.extract(resources);
        return resources;
    }

    extract(res: Object): Sale[] {
        let sales;
        if (res['_embedded']) {
            sales = res['_embedded']['sales'];
        } else {
            sales = res['content'];
        }
        return sales;
    }
}
