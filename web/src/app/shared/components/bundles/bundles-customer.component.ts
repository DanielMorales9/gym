import {Component, OnDestroy, OnInit} from '@angular/core';
import {Bundle} from '../../model';
import {BundleService} from '../../../core/controllers';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../../core/utilities';
import {BundleCustomerHelperService, QueryableDatasource} from '../../../core/helpers';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PolicyService} from '../../../core/policy';

@Component({
    templateUrl: './bundles-customer.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class BundlesCustomerComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto acquistato';

    query: any;
    copyQuery: any;
    id: number;

    ds: QueryableDatasource<Bundle>;
    canDelete: boolean;
    canEdit: boolean;

    private pageSize = 10;
    private sub: Subscription;

    constructor(private service: BundleService,
                private helper: BundleCustomerHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog,
                private policy: PolicyService,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<Bundle>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.getPolicies();
        this.sub = this.route.queryParams.subscribe(value => {
            this.copyQuery = {};
            // tslint:disable
            for (let key in value) {
                this.copyQuery[key] = value[key];
            }
            console.log(this.copyQuery);
            this.id = this.copyQuery['id'];
            this.get(this.copyQuery);
        });
    }

    private getPolicies() {
        this.canDelete = this.policy.get('bundle', 'canDelete');
        this.canEdit = this.policy.get('bundle', 'canEdit');
    }


    private get(query: {}) {
        // TODO fix
        this.ds.setQuery(query);
        this.ds.fetchPage(0);
    }

    async handleEvent($event) {
        if ($event.type === 'info') {
            this.goToDetails($event.bundle);
        } else {
            console.error(`Operazione non riconosciuta: ${$event.type}`);
        }
    }

    // private updateQueryParams() {
    //     this.queryParams = {query: this.query};
    //     this.router.navigate(
    //         [],
    //         {
    //             relativeTo: this.activatedRoute,
    //             queryParams: this.queryParams,
    //             queryParamsHandling: 'merge', // remove to replace all query params by provided
    //         });
    // }

    search($event?) {
        // TODO search feature
        this.snackbar.open('Questa funzione sarà disponibile a breve');

        // if ($event) {
        //     this.query = $event.query;
        // }
        // this.ds.setQuery(this.query);
        // this.ds.fetchPage(0);
        // this.updateQueryParams();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private async goToDetails(bundle: any) {
        await this.router.navigate(['bundles', bundle.id], {relativeTo: this.route.parent})
    }

}
