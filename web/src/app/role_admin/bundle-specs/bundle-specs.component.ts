import {Component, OnInit} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {BundleSpecsService} from '../../core/controllers';
import {MatDialog} from '@angular/material';
import {BundleSpecModalComponent} from '../../shared/components/bundle-specs';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleSpecHelperService, QueryableDatasource} from '../../core/helpers';

@Component({
    templateUrl: './bundle-specs.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class BundleSpecsComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    query: string;
    private queryParams: { query: string };

    private pageSize = 10;
    ds: QueryableDatasource<BundleSpecification>;

    constructor(private service: BundleSpecsService,
                private router: Router,
                private dialog: MatDialog,
                private helper: BundleSpecHelperService,
                private activatedRoute: ActivatedRoute,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.pageSize, this.query);
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

        const dialogRef = this.dialog.open(BundleSpecModalComponent, {
            data: {
                title: title,
            }
        });

        dialogRef.afterClosed().subscribe(bundleSpec => {
            if (bundleSpec) { this.createBundleSpec(bundleSpec); }
        });
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteBundleSpec($event.bundleSpec);
                break;
            case 'patch':
                this.toggleDisabled($event.bundleSpec);
                break;
            case 'put':
                this.modifyBundleSpec($event.bundleSpec);
                break;
            case 'info':
                this.goToDetails($event.bundleSpec);
                break;
            case 'list':
                this.goToList($event.bundleSpec);
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

    private createBundleSpec(bundleSpec: BundleSpecification) {
        delete bundleSpec.id;
        this.service.post(bundleSpec).subscribe(_ => {
            const message = `Il pacchetto ${bundleSpec.name} è stato creato`;
            this.snackbar.open(message);
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }

    private deleteBundleSpec(bundleSpec: BundleSpecification) {
        const confirmed = confirm(`Vuoi eliminare il pacchetto ${bundleSpec.name}?`);
        if (confirmed) {
            this.service.delete(bundleSpec.id).subscribe(_ => this.search(),
                err => this.snackbar.open(err.error.message));
        }
    }

    private toggleDisabled(bundleSpec: BundleSpecification) {
        bundleSpec.disabled = !bundleSpec.disabled;
        this.service.patch(bundleSpec).subscribe(res => console.log(res), err => this.snackbar.open(err.error.message));
    }

    private modifyBundleSpec(bundleSpec: BundleSpecification) {
        this.service.patch(bundleSpec).subscribe(_ => {
            const message = `Il pacchetto ${bundleSpec.name} è stato modificato`;
            this.snackbar.open(message);
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }

    private goToDetails(bundleSpec: any) {
        const r = this.router.navigate(['admin', 'bundleSpecs', bundleSpec.id]);
    }

    private goToList(bundleSpec: any) {
        this.router.navigate(['admin', 'bundles'],
            {queryParams: {
                    specId: bundleSpec.id
                }});
    }
}
