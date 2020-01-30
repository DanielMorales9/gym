import {Injectable} from '@angular/core';
import {Sale} from '../../shared/model';
import {SalesService} from '../controllers';
import {HelperService} from './helper.service';
import {Observable} from 'rxjs';
import {GymService} from '../utilities';

@Injectable()
export class SaleHelperService extends HelperService<Sale> {

    constructor(private service: SalesService,
                private gymService: GymService) {
        super();
    }

    createSale(customerId: number) {
        return this.service.createSale(customerId);
    }

    delete(id: number) {
        return this.service.delete(id);
    }

    addSalesLineItem(saleId: number, bundleSpecId: any) {
        return this.service.addSalesLineItem(saleId, {bundleSpecId: bundleSpecId});
    }

    deleteSalesLineItem(saleId: number, sliId: any) {
        return this.service.deleteSalesLineItem(saleId, sliId);
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
        if (!!query.date) {
            query = Object.assign({}, query);
            const date = new Date(query.date);
            query.date = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear();
        }

        if (!!query.name) {
            // this is for refactoring reasons
            query.lastName = query.name;
            delete query.name;
        }

        let observable;
        if (!!query.id) {
            observable = this.service.findByCustomer(query, page, size);
        } else if (!!query.lastName || !!query.date) {
            observable = this.service.search(query, page, size);
        } else {
            observable = this.service.get(page, size, query);
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
        return res['content'];
    }
}
