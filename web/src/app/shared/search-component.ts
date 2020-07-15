import {Directive, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {BaseComponent} from './base-component';
import {QueryableDatasource} from '../core/helpers';
import {Bundle} from './model';
import {ActivatedRoute, Router} from '@angular/router';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class SearchComponent<T> extends BaseComponent {

    ds: QueryableDatasource<T>;

    protected query: any;
    protected queryParams: any;

    constructor(protected router: Router,
                protected route: ActivatedRoute) {
        super();
    }

    protected updateQueryParams($event) {
        if (!$event) { $event = {}; }

        this.queryParams = this.query = $event;
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }
    protected abstract initQueryParams($event?);

    search($event?) {
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }
}
