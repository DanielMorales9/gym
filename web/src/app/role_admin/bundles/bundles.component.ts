import {Component, OnDestroy, OnInit} from '@angular/core';
import {Bundle} from '../../shared/model';
import {BundleService} from '../../core/controllers';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleHelperService, QueryableDatasource} from '../../core/helpers';
import {Subscription} from 'rxjs';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class BundlesComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna edizione disponibile';

    query: any;
    private specId: number;

    private queryParams: { query: string };
    private pageSize = 10;
    ds: QueryableDatasource<Bundle>;
    private sub: Subscription;

    constructor(private service: BundleService,
                private helper: BundleHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<Bundle>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(value => {
            const query = {};
            // tslint:disable
            for (let key in value) {
                query[key] = value[key];
            }
            console.log(query);
            this.specId = query['specId'];
            this.ds.setQuery(query);
            this.ds.fetchPage(0);
        });
    }


    handleEvent($event) {
        switch ($event.type) {
            case 'info':
                this.goToDetails($event.bundle);
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
        // TODO create feature
        this.snackbar.open('Questa funzione sarà disponibile a breve');
        // const title = 'Crea Nuova Edizione';

        // const dialogRef = this.dialog.open(BundleSpecModalComponent, {
        //     data: {
        //         title: title,
        //     }
        // });

        // dialogRef.afterClosed().subscribe(bundle => {
        //     if (bundle) { this.createBundleSpec(bundle); }
        // });
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
}
