import {Component, OnInit} from '@angular/core';
import {Bundle} from '../model';
import {BundleService} from '../../core/controllers';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {BundleHelperService, QueryableDatasource} from '../../core/helpers';
import {MatDialog} from '@angular/material/dialog';
import {BundleModalComponent} from './bundle-modal.component';
import {PolicyService} from '../../core/policy';
import {first} from 'rxjs/operators';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../styles/list-items.css', '../../styles/root.css']
})
export class BundlesComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna edizione disponibile';

    query: any;
    specId: number;
    copyQuery: any;
    canDelete: boolean;
    ds: QueryableDatasource<Bundle>;
    canEdit: boolean;

    private queryParams: { query: string };
    private pageSize = 10;

    constructor(private service: BundleService,
                private helper: BundleHelperService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog,
                private policy: PolicyService,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<Bundle>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.getPolicies();
        this.route.queryParams.pipe(first()).subscribe(value => {
            this.copyQuery = {};
            // tslint:disable
            for (let key in value) {
                this.copyQuery[key] = value[key];
            }
            this.specId = this.copyQuery['specId'];
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
        switch ($event.type) {
            case 'info':
                this.goToDetails($event.bundle);
                break;
            case 'delete':
                await this.delete($event.bundle);
                break;
            case 'edit':
                await this.edit($event.bundle);
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
            }
        });

        dialogRef.afterClosed().subscribe(async params => {
            if (params) {
                if (!!this.specId) {
                    params['specId'] = this.specId;
                }
                this.createCourseBundle(params);
            }
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

    private async goToDetails(bundle: any) {
        await this.router.navigate(['bundles', bundle.id], {relativeTo: this.route.parent})
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

    private async edit(bundle: any) {
        const [data, error] = await this.service.patch(bundle);
        if (error) {
            throw error;
        }
        this.get(this.copyQuery);
    }
}
