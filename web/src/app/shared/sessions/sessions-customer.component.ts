import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {QueryableDatasource} from '../../core/helpers';
import {MatDialog} from '@angular/material/dialog';
import {first, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base-component';
import {Session} from '../model/session.class';
import {SessionService} from '../../core/controllers/session.service';
import {SessionHelperService} from '../../core/helpers/session-helper.service';

@Component({
    templateUrl: './sessions-customer.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsCustomerComponent extends BaseComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna sessione';

    query: any;
    customerId: any;

    ds: QueryableDatasource<Session>;

    private queryParams: any;
    private pageSize = 10;

    constructor(private service: SessionService,
                private helper: SessionHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
        super();
        this.ds = new QueryableDatasource<Session>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.customerId = this.route.snapshot.params['id'];
        this.initQueryParams(this.customerId);
    }

    private initQueryParams(id?) {
        this.route.queryParams
            .pipe(
                first(),
                takeUntil(this.unsubscribe$))
            .subscribe(params => {
                this.queryParams = Object.assign({}, params);
                if (!!id) {
                    this.queryParams.customerId = id;
                }
                if (!!this.queryParams.date) {
                    this.queryParams.date = new Date(this.queryParams.date);
                }
                this.search(this.queryParams);
            });
    }

    private updateQueryParams(queryParams?) {
        if (!queryParams) { queryParams = {}; }
        if (this.customerId) { queryParams.customerId = this.customerId; }
        this.queryParams = this.query = queryParams;
        this.router.navigate(
            [],
            {
                replaceUrl: true,
                relativeTo: this.route,
                queryParams: this.queryParams,
            });
    }

    search($event?) {
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }

    handleEvent($event) {
        if ($event.type === 'info') {
            this.goToDetails($event.session);
        }
        else if ($event.type === 'assign') {
            this.assignWorkout($event.session);
        }
    }

    private goToDetails(session: any) {
        this.router.navigate([session.id, 'programme'], {relativeTo: this.route});
    }


    private assignWorkout(session: any) {
        this.router.navigate([session.id, 'assignWorkout'], {relativeTo: this.route});
    }

    trackBy(index, item) {
        return item ? item.id : index;
    }
}
