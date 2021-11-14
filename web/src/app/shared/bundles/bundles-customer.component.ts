import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Bundle} from '../model';
import {BundleService} from '../../core/controllers';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleCustomerHelperService, QueryableDatasource} from '../../core/helpers';
import {MatDialog} from '@angular/material/dialog';
import {PolicyService} from '../../core/policy';
import {first, takeUntil} from 'rxjs/operators';
import {SearchComponent} from '../search-component';

@Component({
    templateUrl: './bundles-customer.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundlesCustomerComponent extends SearchComponent<Bundle> implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto acquistato';

    query: any;
    id: number;

    filters = [
        {name: 'Attivi', value: false},
        {name: 'Terminati', value: true},
        {name: 'Entrambi', value: undefined}];
    filterName = 'expired';
    selected = undefined;

    constructor(private service: BundleService,
                private helper: BundleCustomerHelperService,
                protected route: ActivatedRoute,
                protected router: Router,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
        super(router, route);
        this.ds = new QueryableDatasource<Bundle>(helper, this.query);
    }

    ngOnInit(): void {
        this.route.params.pipe(first()).subscribe(param => {
            this.id = +param['id'];
            this.initQueryParams();
        });
    }

    protected initDefaultQueryParams(params: any): any {
        if (Object.keys(params).length > 0) {
            if (!!params.date) {
                params.date = new Date(params.date);
            }
        }
        if (!!this.id) {
            params.id = this.id;
        }
        return params;
    }

    protected enrichQueryParams($event?): any {
        if (this.id) {
            $event.id = this.id;
        }
        return $event;
    }

    handleEvent($event) {
        if ($event.type === 'info') {
            this.goToDetails($event.bundle);
        } else if ($event.type === 'edit') {
            this.service.patchBundle($event.bundle)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe( {
                    error: err => this.snackbar.open(err.error.message)
                });
        }
    }

    private goToDetails(bundle: any) {
        this.router.navigate(['bundles', bundle.id], {
            relativeTo: this.route.parent
        });
    }
}
