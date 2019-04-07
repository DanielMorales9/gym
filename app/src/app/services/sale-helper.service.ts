import { Injectable } from '@angular/core'
import {SaleLineItem, Sale, Bundle, User} from "../shared/model";
import {SalesService} from "../shared/services";

@Injectable()
export class SaleHelperService {

    constructor(private saleService: SalesService) {}

    getSaleLineItems(sale: Sale) {
        let endpoint;
        if (sale['_links'])
            endpoint = sale['_links']['salesLineItems'].href;
        else
            endpoint = `/sales/${sale.id}/salesLineItems`;
        if (!sale.salesLineItems)
            sale.salesLineItems = [];
        this.saleService.getEndpoint(endpoint).subscribe(res => {
                res["_embedded"].salesLineItems
                    .map(res1 => {
                        let endpoint = res1['_links']['bundleSpecification'].href;
                        let line = new SaleLineItem();
                        line.id = res1.id;
                        this.saleService.getEndpoint(endpoint)
                            .subscribe( res2 => {
                                line.bundleSpecification = res2 as Bundle;
                                sale.salesLineItems.push(line as SaleLineItem);
                            });
                    });
            })
    }

    static unwrapLines(sale: Sale) {
        if (sale.salesLineItems)
            if (sale.salesLineItems['_embedded'])
                sale.salesLineItems = sale.salesLineItems['_embedded']['salesLineItemResources']

    }

    createSale(email:string, id:number) {
        return this.saleService.createSale(email, id);
    }

    delete(id: number) {
        return this.saleService.delete(id);
    }

    getCustomer(sale: Sale) {
        let endpoint;
        if (sale['_links'])
            endpoint = sale['_links'].customer.href;
        else
            endpoint = `/sales/${sale.id}/customer`;
        this.saleService.getEndpoint(endpoint)
            .subscribe( res=> {
                sale.customer = res as User;
            })
    }

    addSalesLineItem(saleId: number, bundleId: any) {
        return this.saleService.addSalesLineItem(saleId, bundleId);
    }

    deleteSalesLineItem(saleId: number, adminId: any) {
        return this.saleService.deleteSalesLineItem(saleId, adminId);
    }

    confirmSale(id: number) {
        return this.saleService.confirmSale(id);
    }

    findById(saleId: number) {
        return this.saleService.findById(saleId);
    }

}
