import {Component, OnInit} from '@angular/core';
import {AppService, ChangeViewService, SaleHelperService, SnackBarService} from '../../../services';
import {Sale, User} from '../../../shared/model';
import {SalesService} from '../../../shared/services';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {Router} from '@angular/router';


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class SalesComponent {

    private SIMPLE_NO_CARD_MESSAGE = "Nessuna vendita disponibile";
    private SEARCH_NO_CARD_MESSAGE = "Nessuna vendita disponibile con questa query";

    empty: boolean;
    query: string;

    current_role_view: number;
    no_card_message: string;

    private pageSize: number = 15;
    ds: SaleDataSource;

    constructor(private service: SalesService,
                private helper: SaleHelperService,
                private app: AppService,
                private router: Router,
                private snackbar: SnackBarService) {
        this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
        this.current_role_view = app.current_role_view;

        this.ds = new SaleDataSource(service, helper, this.pageSize, this.query);
    }

    // TODO enable mixed queries (date or text)
    // TODO create date picker toolbar
    // TODO refactor data sources by leveraging of polymorphism and generics

    search($event?) {
        if ($event)
            this.query = $event.query;
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteSale($event.sale);
                break;
            case 'pay':
                this.paySale($event.sale, $event.amount);
                break;
        }
    }

    private deleteSale(sale: Sale) {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            sale.customer.firstName + " " + sale.customer.lastName + "?");
        if (confirmed) {
            this.helper.delete(sale.id)
                .subscribe( _ => {
                    this.snackbar.open("Vendita eliminata per il cliente " + sale.customer.lastName + "!");
                    return this.search()
                }, err => this.snackbar.open(err.error.message))
        }
    }

    private paySale(sale: Sale, amount: number) {
        this.service.pay(sale.id, amount)
            .subscribe(_ => this.search());
    }
}


class SaleDataSource extends DataSource<Sale | undefined> {
    private length = 1;
    private cachedData = Array.from<Sale>({length: this.length});
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<(Sale | undefined)[]>(this.cachedData);
    private subscription = new Subscription();
    empty: boolean = false;


    constructor(private service: SalesService,
                private helper: SaleHelperService,
                private pageSize: number,
                private query: string) {
        super()
    }

    connect(collectionViewer: CollectionViewer): Observable<(Sale | undefined)[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            let end = (this.length < range.end-1) ? this.length : range.end - 1;
            const endPage = this.getPageForIndex(end);
            for (let i = startPage; i <= endPage; i++) {
                this.fetchPage(i);
            }
        }));
        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    setQuery(query: string) {
        this.query = query;
        this.fetchedPages = new Set<number>();
        this.cachedData = [];
        this.fetchPage(0)
    }

    fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);
        this.search(page)
    }

    private search(page: number) {
        let observable;
        if (this.query === undefined || this.query == '')
            observable = this.service.get(page, this.pageSize);

        else
            observable = this.service.searchByLastName(this.query, page, this.pageSize);
        observable.subscribe(res => {
            let newLength = SaleDataSource.getLength(res);
            if (this.length != newLength) {
                this.length = newLength;
                this.cachedData = Array.from<Sale>({length: this.length});
            }

            let sales = SaleDataSource.getSales(res);
            sales.map(sale => {
                if (!sale.customer) sale.customer = new User();
                this.helper.getCustomer(sale);
                return sale
            });

            this.empty = sales.length == 0;
            this.cachedData.splice(page * this.pageSize, this.pageSize, ...sales);
            this.dataStream.next(this.cachedData);
        });
    }

    private static getSales(res) {
        let sales;
        if (res['_embedded'])
            sales = res['_embedded']['sales'];
        else
            sales = res['content'];
        return sales;
    }

    private static getLength(res) {
        let length;
        if (res['page']) {
            length = res['page']['totalElements'];
        }
        else {
            length = res['totalElements']
        }
        return length
    }

}
