import {Component, OnInit, ViewChild} from '@angular/core';
import {Bundle, User} from "../../shared/model";
import {PagerComponent} from "../../shared/components";
import {BundlesService, UserHelperService} from "../../shared/services";
import {MatDialog} from "@angular/material";
import {BundleModalComponent} from "./bundle-modal.component";
import {DataSource} from "@angular/cdk/table";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {CollectionViewer} from "@angular/cdk/collections";
import {UserDataSource} from "../users";

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../root.css']
})
export class BundlesComponent {

    SIMPLE_NO_CARD_MESSAGE = "Nessun pacchetto disponibile";

    query: string;
    private pageSize: number = 5;

    ds: BundleDataSource;

    constructor(private service: BundlesService,
                private dialog: MatDialog) {
        this.ds = new BundleDataSource(this.service, this.pageSize, this.query);
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: 'Crea Nuovo Pacchetto',
                message: 'è stato modificato'
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

export class BundleDataSource extends DataSource<Bundle> {
    private fetchedPages = new Set<number>();
    private subscription = new Subscription();
    private cachedData = new Array<Bundle>();
    private dataStream = new BehaviorSubject<Bundle[]>(this.cachedData);
    empty: boolean = false;

    constructor(private service: BundlesService,
                private pageSize: number,
                private query: string) {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<Bundle[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
            for (let i = startPage; i <= endPage; i++) {
                this.fetchPage(i);
            }
        }));

        this.fetchPage(0);
        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);
        this.search(page)
    }

    setQuery(query: string) {
        this.query = query;
        this.fetchedPages = new Set<number>();
        this.cachedData = [];
    }

    private search(page: number) {
        if (this.query === undefined || this.query == ''){

            this.service.get(page, this.pageSize)
                .subscribe(res => {
                    let bundles = res['_embedded']['aTrainingBundleSpecifications'];
                    this.cachedData.splice(page * this.pageSize, ...bundles);
                    this.empty = bundles.length == 0;
                    this.dataStream.next(bundles);
                })
        }
        else {

            this.service.search(this.query, page, this.pageSize)
                .subscribe(res => {
                    let bundles = res['content'];
                    console.log(bundles);
                    this.cachedData.splice(page * this.pageSize, ...bundles);
                    this.empty = bundles.length == 0;
                    this.dataStream.next(bundles);
                })
        }
    }
}