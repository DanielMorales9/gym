import { Injectable } from '@angular/core';
import {SaleLineItem, Sale, Bundle, User} from '../model';
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

    getSaleLineItems(sale: Sale) {
        let endpoint;
        if (sale['_links']) {
            endpoint = sale['_links']['salesLineItems'].href;
        } else {
            endpoint = `/sales/${sale.id}/salesLineItems`;
        }
        if (!sale.salesLineItems) {
            sale.salesLineItems = [];
        }
        this.service.getEndpoint(endpoint).subscribe(res => {
            res['_embedded'].salesLineItems
                .map(res1 => {
                    const end = res1['_links']['bundleSpecification'].href;
                    const line = new SaleLineItem();
                    line.id = res1.id;
                    this.service.getEndpoint(end)
                        .subscribe( res2 => {
                            line.bundleSpecification = res2 as Bundle;
                            sale.salesLineItems.push(line as SaleLineItem);
                        });
                });
        });
    }

    createSale(email: string, id: number) {
        return this.service.createSale(email, id);
    }

    delete(id: number) {
        return this.service.delete(id);
    }

    getCustomer(sale: Sale) {
        let endpoint;
        if (sale['_links']) {
            endpoint = sale['_links'].customer.href;
        } else {
            endpoint = `/sales/${sale.id}/customer`;
        }
        this.service.getEndpoint(endpoint).subscribe( (res: User) => {
                sale.customer = res;
            });
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
        switch (query.type) {
            case 'query':
                observable = this.service.searchByLastName(query.value, page, size);
                break;
            case 'date':
                date = query.value;
                value = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
                observable = this.service.searchByDate(value, page, size);
                break;
            case 'customerDate':
                date = query.date;
                value = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
                observable = this.service.searchByDateAndId(value, query.id, page, size);
                break;
            case 'customerId':
                observable = this.service.findUserSales(query.id, page, size);
                break;
            default:
                throw Error('Unexpected query type: ' + query);
        }
        return observable;
    }

    getOrSearch(query: any, page: number, size: number): Observable<Object> {
        console.log(query);
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

        resources.map(sale => {
            if (!sale.customer) { sale.customer = new User(); }
            this.getCustomer(sale);
            return sale;
        });
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