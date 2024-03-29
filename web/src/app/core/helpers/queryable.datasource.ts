import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {HelperService} from './index';

export class QueryableDatasource<T> extends DataSource<any> {

    private length = 1;
    private cachedData = Array.from<T |undefined>({length: this.length});
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<(T |undefined)[]>(this.cachedData);
    private subscription = new Subscription();
    empty = false;
    private PAGE_SIZE = 10;


    constructor(private helper: HelperService<T>,
                private query: Object,
                private pageSize?: number) {
        super();
        this.pageSize = !this.pageSize ? this.PAGE_SIZE : this.pageSize;
    }

    connect(collectionViewer: CollectionViewer): Observable<(T |undefined)[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const end = (this.length < range.end - 1) ? this.length : range.end - 1;
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
        this.initCacheData();
        this.fetchPage(0);
    }

    private initCacheData() {
        this.fetchedPages = new Set<number>();
        this.cachedData = [];
    }

    fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.search(page);
    }

    private search(page: number) {
        this.helper.getOrSearch(this.query, page, this.pageSize)
            .subscribe(res => {
                const newLength = this.helper.getLength(res);
                const resources = this.helper.preProcessResources(res);
                if (this.length !== newLength) {
                    this.length = newLength;
                    this.cachedData = Array.from<T | undefined>({length: this.length});
                }

                this.empty = (newLength === 0);
                this.cachedData.splice(page * this.pageSize, this.pageSize, ...resources);
                this.dataStream.next(this.cachedData);
                this.fetchedPages.add(page);
            });
    }

    public refresh(): void {
        this.search(0);
    }

}
