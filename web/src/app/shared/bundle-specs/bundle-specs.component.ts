import {Component, OnInit} from '@angular/core';
import {BundleSpecHelperService, QueryableDatasource} from '../../core/helpers';
import {BundleSpecification} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BundleSpecsService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {first} from 'rxjs/operators';

@Component({
    templateUrl: './bundle-specs.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class BundleSpecsComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    query: any = {};
    private queryParams: any;

    private pageSize = 10;
    ds: QueryableDatasource<BundleSpecification>;
    canDelete: boolean;
    canDisable: boolean;
    canCreate: boolean;

    filters = [
        {name: 'Disattivo', value: true},
        {name: 'Attivo', value: false},
        {name: 'Entrambi', value: undefined}];
    filterName = 'disabled';
    selected = false;

    constructor(private service: BundleSpecsService,
                private router: Router,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private helper: BundleSpecHelperService,
                private policy: PolicyService,
                private snackbar: SnackBarService) {
        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
        this.canDelete = this.policy.get('bundleSpec', 'canDelete');
        this.canDisable = this.policy.get('bundleSpec', 'canDisable');
        this.canCreate = this.policy.get('bundleSpec', 'canCreate');
    }

    private initQueryParams() {
        this.route.queryParams.pipe(first()).subscribe(params => {
            this.queryParams = Object.assign({}, params);
            this.search(this.queryParams);
        });
    }

    private updateQueryParams($event) {
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
                break;
        }
    }

    search($event?) {
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
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
        this.service.patch(bundleSpec).subscribe(res => {}, err => this.snackbar.open(err.error.message));
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
            {
                queryParams: {
                    specId: bundleSpec.id
                }});
    }
}
