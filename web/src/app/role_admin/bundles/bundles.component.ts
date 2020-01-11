import {Component, OnDestroy, OnInit} from '@angular/core';
import {Bundle} from '../../shared/model';
import {BundleService} from '../../core/controllers';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleHelperService, QueryableDatasource} from '../../core/helpers';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {BundleModalComponent} from './bundle-modal.component';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class BundlesComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna edizione disponibile';

    query: any;
    copyQuery: any;
    specId: number;

    private queryParams: { query: string };
    private pageSize = 10;
    ds: QueryableDatasource<Bundle>;
    private sub: Subscription;

    constructor(private service: BundleService,
                private helper: BundleHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<Bundle>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(value => {
            this.copyQuery = {};
            // tslint:disable
            for (let key in value) {
                this.copyQuery[key] = value[key];
            }
            console.log(this.copyQuery);
            this.specId = this.copyQuery['specId'];
            this.get(this.copyQuery);
        });
    }


    private get(query: {}) {
        // TODO fix
        this.ds.setQuery(query);
        this.ds.fetchPage(0);
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'info':
                this.goToDetails($event.bundle);
                break;
            case 'delete':
                this.delete($event.bundle);
                break;
            default:
                console.error(`Operazione non riconosciuta: ${$event.type}`);
                break;
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

    openDialog(): void {
        const title = 'Crea Nuova Edizione';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                specId: this.specId
            }
        });

        dialogRef.afterClosed().subscribe(params => {
            if (params) { this.createCourseBundle(params); }
        });
    }

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

    private goToDetails(bundle: any) {
        this.router.navigate(['bundles', bundle.id], {relativeTo: this.route.parent})
    }

    private async createCourseBundle(params: any) {
        const [data, error] = await this.service.post(params);
        if (error) {
            throw error;
        }
        this.get(this.copyQuery);
    }

    private async delete(bundle: any) {
        const [data, error] = await this.service.delete(bundle.id);
        if (error) {
            throw error;
        }
        this.get(this.copyQuery);
    }
}
