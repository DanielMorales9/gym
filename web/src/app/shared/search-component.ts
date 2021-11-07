import {Directive} from '@angular/core';
import {BaseComponent} from './base-component';
import {QueryableDatasource} from '../core/helpers';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class SearchComponent<T> extends BaseComponent {

    ds: QueryableDatasource<T>;

    public query: any;
    protected queryParams: any;

    protected constructor(protected router: Router,
                          protected route: ActivatedRoute) {
        super();
    }

    protected updateQueryParams($event) {
        if (!$event) { $event = {}; }
        $event = this.enrichQueryParams($event);

        this.queryParams = this.query = $event;
        this.router.navigate([], {
            relativeTo: this.route,
            replaceUrl: true,
            queryParams: this.queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }

    protected enrichQueryParams(params: any) {
        return params;
    }

    protected initDefaultQueryParams(params: any): any {
        return params;
    }

    protected initQueryParams() {
        this.route.queryParams.pipe(first()).subscribe(params => {
            this.queryParams = this.initDefaultQueryParams(Object.assign({}, params));
            this.dataSourceSearch(this.queryParams);
        });
    }

    dataSourceSearch($event?) {
        if ($event) {
            Object.keys($event).forEach(key => {
                if ($event[key] === undefined || $event[key] === '' || $event[key] === null) {
                    delete $event[key];
                }
            });
        }
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }
}
