import {Component} from '@angular/core';
import {Bundle} from "../../../shared/model";
import {BundlesService} from "../../../shared/services";
import {MatDialog} from "@angular/material";
import {BundleModalComponent} from "./bundle-modal.component";
import {DataSource} from "@angular/cdk/table";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {CollectionViewer} from "@angular/cdk/collections";

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../../search-and-list.css', '../../../root.css']
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

    openDialog(b?: number): void {
        let title;
        let message;
        if (b) {
            title = "Modifica Pacchetto";
            message = "è stato modificato";
        }
        else {
            title = "Crea Nuovo Pacchetto";
            message = "è stato creato";
        }

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                message: message,
                bundle: b,
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

    deleteBundle(b: Bundle) {
        let confirmed = confirm(`Vuoi eliminare il pacchetto ${b.name}?`);
        if (confirmed) {
            this.service.delete(b.id).subscribe(_ => this.getBundles())
        }
    }

    toggleDisabled(b: Bundle) {
        b.disabled = !b.disabled;
        this.service.put(b);
    }
}

export class BundleDataSource extends DataSource<Bundle | undefined> {
    private length = 1;
    private cachedData = Array.from<Bundle>({length: this.length});
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<(Bundle | undefined)[]>(this.cachedData);
    private subscription = new Subscription();
    empty: boolean = false;

    constructor(private service: BundlesService,
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
        if (this.query === undefined || this.query == '') {
            this.service.get(page, this.pageSize).subscribe(res => {
                let newLenght = res['page']['totalElements'];
                if (this.length != newLenght) {
                    this.length = newLenght;
                    this.cachedData = Array.from<Bundle>({length: this.length});
                }
                let bundles = res['_embedded']['aTrainingBundleSpecifications'];
                bundles.map(v => v.type = 'P');
                this.empty = bundles.length == 0;
                this.cachedData.splice(page * this.pageSize, this.pageSize, ...bundles);
                this.dataStream.next(this.cachedData);
            })
        }
        else {

            this.service.search(this.query, page, this.pageSize).subscribe(res => {
                let newLenght = res['totalElements'];
                if (this.length != newLenght) {
                    this.length = newLenght;
                    this.cachedData = Array.from<Bundle>({length: this.length});
                }

                let bundles = res['content'];
                bundles.map(v => v.type = 'P');
                this.empty = bundles.length == 0;
                this.cachedData.splice(page * this.pageSize, this.pageSize, ...bundles);
                this.dataStream.next(this.cachedData);
            })
        }
    }
}
