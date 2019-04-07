import {Component} from '@angular/core';
import {Bundle} from '../../../shared/model';
import {ABundleService, BundlesService} from '../../../shared/services';
import {MatDialog} from '@angular/material';
import {BundleModalComponent} from './bundle-modal.component';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class BundlesComponent {

    SIMPLE_NO_CARD_MESSAGE = "Nessun pacchetto disponibile";

    query: string;
    private pageSize: number = 10;

    ds: BundleDataSource;

    constructor(private service: BundlesService,
                private dialog: MatDialog) {

        this.ds = new BundleDataSource(service, this.pageSize, this.query);

        // for(let _i= 0; _i < 50; _i++) {
        //    let bundle = new Bundle();
        //    bundle.name= 'winter_pack_'+_i;
        //    bundle.description= 'winter_pack_'+_i;
        //    bundle.type = 'P';
        //    bundle.price = 11;
        //    bundle.numSessions = 11;
        //    bundle.disabled = false;
        //    this.service.post(bundle).subscribe(value => console.log(value))
        // }
    }

    openDialog(): void {
        let title;
        let message;
        title = "Crea Nuovo Pacchetto";
        message = "è stato creato";

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                message: message,
            }
        });

        dialogRef.afterClosed().subscribe(_ => {
            this.getBundles()
        });
    }

    getBundles() {
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
    }
}

export class BundleDataSource extends DataSource<Bundle | undefined> {
    private length = 1;
    private cachedData = Array.from<Bundle>({length: this.length});
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<(Bundle | undefined)[]>(this.cachedData);
    private subscription = new Subscription();
    empty: boolean = false;

    constructor(private service: ABundleService,
                private pageSize: number,
                private query: string) {
        super()
    }

    connect(collectionViewer: CollectionViewer): Observable<(Bundle | undefined)[]> {
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
        let observable: Observable<any>;

        if (this.query === undefined || this.query == '')
            observable = this.service.get(page, this.pageSize);

        else
            observable = this.service.search(this.query, page, this.pageSize);


        observable.subscribe(res => {
            let newLength = BundleDataSource.getLength(res);
            if (this.length != newLength) {
                this.length = newLength;
                this.cachedData = Array.from<Bundle>({length: this.length});
            }
            let bundles = BundleDataSource.getBundles(res);
            this.empty = bundles.length == 0;
            this.cachedData.splice(page * this.pageSize, this.pageSize, ...bundles);
            this.dataStream.next(this.cachedData);
        })
    }

    private static getBundles(res) {
        let bundles;
        if (res['_embedded'])
            bundles = res['_embedded']['aTrainingBundleSpecifications'];
        else
            bundles = res['content'];
        return bundles;
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
