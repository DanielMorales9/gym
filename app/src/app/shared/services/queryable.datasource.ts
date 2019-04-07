import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {HelperService} from './helper.service';

export class QueryableDatasource<T> extends DataSource<any>{
    private length = 1;
    private cachedData = Array.from<T |undefined>({length: this.length});
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<(T |undefined)[]>(this.cachedData);
    private subscription = new Subscription();
    empty: boolean = false;


    constructor(private helper: HelperService<T>,
                private pageSize: number,
                private query: Object) {
        super()
    }

    connect(collectionViewer: CollectionViewer): Observable<(T |undefined)[]> {
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

    setQuery(query: Object) {
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
        this.helper.getOrSearch(this.query, page, this.pageSize)
            .subscribe(res => {
                let newLength = this.helper.getLength(res);
                let resources = this.helper.preProcessResources(res);
                if (this.length != newLength) {
                    this.length = newLength;
                    this.cachedData = Array.from<T | undefined>({length: this.length});
                }

                this.empty = (newLength == 0);
                this.cachedData.splice(page * this.pageSize, this.pageSize, ...resources);
                this.dataStream.next(this.cachedData);
            });
    }

}
