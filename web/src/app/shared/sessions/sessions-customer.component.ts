import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {QueryableDatasource} from '../../core/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Session} from '../model/session.class';
import {SessionService} from '../../core/controllers/session.service';
import {SessionHelperService} from '../../core/helpers/session-helper.service';
import {SearchComponent} from '../search-component';

@Component({
    templateUrl: './sessions-customer.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsCustomerComponent extends SearchComponent<Session> implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna sessione';

    query: any;
    customerId: any;


    constructor(private service: SessionService,
                private helper: SessionHelperService,
                protected route: ActivatedRoute,
                protected router: Router,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
        super(router, route);
        this.ds = new QueryableDatasource<Session>(helper, this.query);
    }

    ngOnInit(): void {
        this.customerId = this.route.snapshot.params['id'];
        this.initQueryParams();
    }

    protected initDefaultQueryParams(params: any): any {
        if (!!this.customerId) {
            params.customerId = this.customerId;
        }
        if (!!this.queryParams.date) {
            params.date = new Date(params.date);
        }
        return params;
    }

    protected enrichQueryParams($event?): any {
        if (this.customerId) { $event.customerId = this.customerId; }
        return $event;
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
