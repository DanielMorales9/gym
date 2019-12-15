import {Component, OnInit} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {BundleSpecsService, QueryableDatasource} from '../../core/controllers';
import {MatDialog} from '@angular/material';
import {BundleModalComponent} from '../../shared/components/bundles';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleHelperService} from '../../core/helpers';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class BundlesComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    query: string;
    private queryParams: { query: string };

    private pageSize = 10;
    ds: QueryableDatasource<BundleSpecification>;

    constructor(private service: BundleSpecsService,
                private router: Router,
                private dialog: MatDialog,
                private helper: BundleHelperService,
                private activatedRoute: ActivatedRoute,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.pageSize, this.query);
        // for(let _i= 0; _i < 50; _i++) {
        //    let bundle = new Bundle();
        //    bundle.name= 'winter_pack_'+_i;
        //    bundle.description= 'winter_pack_'+_i;
        //    bundle.type = 'P';
        //    bundle.price = 11;
        //    bundle.numSessions = 11;
        //    bundle.disabled = false;
        //    this.service.post(bundle).subscribe(value => console.log(value))
        // }
    }

    ngOnInit(): void {
        this.query = this.activatedRoute.snapshot.queryParamMap.get('query') || undefined;
        this.search();
    }

    private updateQueryParams() {
        this.queryParams = {query: this.query};
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    openDialog(): void {
        const title = 'Crea Nuovo Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
            }
        });

        dialogRef.afterClosed().subscribe(bundle => {
            if (bundle) { this.createBundle(bundle); }
        });
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteBundle($event.bundle);
                break;
            case 'patch':
                this.toggleDisabled($event.bundle);
                break;
            case 'put':
                this.modifyBundle($event.bundle);
                break;
            default:
                console.error(`Operazione non riconosciuta: ${$event.type}`);
                break;
        }
    }

    search($event?) {
        if ($event) {
            this.query = $event.query;
        }
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
        this.updateQueryParams();
    }

    private createBundle(bundle: BundleSpecification) {
        console.log(bundle);
        delete bundle.id;
        this.service.post(bundle).subscribe(_ => {
            const message = `Il pacchetto ${bundle.name} è stato creato`;
            this.snackbar.open(message);
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }

    private deleteBundle(bundle: BundleSpecification) {
        const confirmed = confirm(`Vuoi eliminare il pacchetto ${bundle.name}?`);
        if (confirmed) {
            this.service.delete(bundle.id).subscribe(_ => this.search(),
                    err => this.snackbar.open(err.error.message));
        }
    }

    private toggleDisabled(bundle: BundleSpecification) {
        bundle.disabled = !bundle.disabled;
        this.service.patch(bundle).subscribe(res => console.log(res), err => this.snackbar.open(err.error.message));
    }

    private modifyBundle(bundle: BundleSpecification) {
        this.service.patch(bundle).subscribe(_ => {
            const message = `Il pacchetto ${bundle.name} è stato modificato`;
            this.snackbar.open(message);
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }
}
