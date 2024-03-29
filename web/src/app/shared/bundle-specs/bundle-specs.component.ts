import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BundleSpecHelperService, QueryableDatasource} from '../../core/helpers';
import {BundleSpecification, CourseBundleSpecification} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BundleSpecsService} from '../../core/controllers';
import {PolicyServiceDirective} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {of} from 'rxjs';
import {SearchComponent} from '../search-component';

@Component({
    templateUrl: './bundle-specs.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleSpecsComponent extends SearchComponent<BundleSpecification> implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    query: any = {};

    canCreate: boolean;

    filters = [
        {name: 'Disattivo', value: true},
        {name: 'Attivo', value: false},
        {name: 'Entrambi', value: undefined}];
    filterName = 'disabled';
    selected = false;

    constructor(private service: BundleSpecsService,
                protected router: Router,
                protected route: ActivatedRoute,
                private dialog: MatDialog,
                private helper: BundleSpecHelperService,
                private policy: PolicyServiceDirective,
                private snackbar: SnackBarService) {
        super(router, route);
        this.ds = new QueryableDatasource<BundleSpecification>(helper, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
        this.canCreate = this.policy.get('bundleSpec', 'canCreate');
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

    private createBundleSpec(bundleSpec: BundleSpecification) {
        delete bundleSpec.id;
        this.service.post(bundleSpec)
            .subscribe(_ => {
                const message = `Il pacchetto ${bundleSpec.name} è stato creato`;
                this.snackbar.open(message);
                this.dataSourceSearch();
            }, err => this.snackbar.open(err.error.message));
    }

    private deleteBundleSpec(bundleSpec: BundleSpecification) {
        of(confirm(`Vuoi eliminare il pacchetto ${bundleSpec.name}?`))
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap((v: any) => this.service.deleteBundleSpecs(bundleSpec.id))
            ).subscribe(_ => this.dataSourceSearch(),
            err => this.snackbar.open(err.error.message));
    }

    private toggleDisabled(bundleSpec: BundleSpecification) {
        bundleSpec.disabled = !bundleSpec.disabled;
        this.service.patchBundleSpecs(bundleSpec).subscribe(res => {}, err => this.snackbar.open(err.error.message));
    }

    private modifyBundleSpec(bundleSpec: BundleSpecification) {
        this.service.patchBundleSpecs(bundleSpec).subscribe(_ => {
            const message = `Il pacchetto ${bundleSpec.name} è stato modificato`;
            this.snackbar.open(message);
            this.dataSourceSearch();
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

    trackBy(index, item) {
        return item ? item.id : index;
    }

}
