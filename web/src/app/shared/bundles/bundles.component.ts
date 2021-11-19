import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Bundle} from '../model';
import {BundleService} from '../../core/controllers';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleHelperService, QueryableDatasource} from '../../core/helpers';
import {MatDialog} from '@angular/material/dialog';
import {PolicyService} from '../../core/policy';
import {takeUntil} from 'rxjs/operators';
import {SearchComponent} from '../search-component';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundlesComponent extends SearchComponent<Bundle> implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto acquistato';

    id: number;

    filters = [
        {name: 'Attivi', value: false},
        {name: 'Terminati', value: true},
        {name: 'Entrambi', value: undefined}];
    filterName = 'expired';
    selected = undefined;

    constructor(private service: BundleService,
                private helper: BundleHelperService,
                protected route: ActivatedRoute,
                protected router: Router,
                private dialog: MatDialog,
                private policy: PolicyService,
                private snackbar: SnackBarService) {
        super(router, route);
        this.ds = new QueryableDatasource<Bundle>(helper, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
    }

    protected initDefaultQueryParams(params: any): any {
        if (Object.keys(params).length > 0) {
            if (!!params.time) {
                params.time = new Date(params.time);
            }
        }
        return params;
    }

    protected enrichQueryParams($event?): any {
        if (this.id) { $event.id = this.id; }
        return $event;
    }

    handleEvent($event) {
        if ($event.type === 'info') {
            this.goToDetails($event.bundle);
        } else if ($event.type === 'edit') {
            this.editBundle($event.bundle);
        } else if ($event.type === 'userInfo') {
            this.goToUserDetails($event.user);
        } else if ($event.type === 'delete') {
            this.deleteBundle($event.bundle);
        }
    }

    private deleteBundle(bundle) {
        this.service.deleteBundle(bundle.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(_ => this.ds.refresh(),
                err => this.snackbar.open(err.error.message)
            );
    }

    private editBundle(bundle) {
        this.service.patchBundle(bundle)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(_ => this.ds.refresh(),
                err => this.snackbar.open(err.error.message)
            );
    }

    private goToUserDetails(user) {
        this.router.navigate(['users', user.id], {
            relativeTo: this.route.parent
        });
    }

    private goToDetails(bundle: any) {
        this.router.navigate(['bundles', bundle.id], {
            relativeTo: this.route.parent
        });
    }

    trackBy(index, item) {
        return item ? item.id : index;
    }
}
