import {Component} from '@angular/core';
import {Bundle} from '../../../shared/model';
import {BundleHelperService, BundlesService, QueryableDatasource} from '../../../shared/services';
import {MatDialog} from '@angular/material';
import {BundleModalComponent} from './bundle-modal.component';
import {SnackBarService} from '../../../services';

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class BundlesComponent {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun pacchetto disponibile';

    query: string;
    private pageSize = 10;

    ds: QueryableDatasource<Bundle>;

    constructor(private service: BundlesService,
                private helper: BundleHelperService,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {

        this.ds = new QueryableDatasource<Bundle>(helper, this.pageSize, this.query);

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

    openDialog(): void {
        const title = 'Crea Nuovo Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
            }
        });

        dialogRef.afterClosed().subscribe(bundle => {
            this.createBundle(bundle);
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
    }

    private createBundle(bundle: Bundle) {
        console.log(bundle);
        delete bundle.id;
        this.service.post(bundle).subscribe(_ => {
            const message = `Il pacchetto ${bundle.name} è stato creato`;
            this.snackbar.open(message);
            this.search();
        });
    }

    private deleteBundle(bundle: Bundle) {
        const confirmed = confirm(`Vuoi eliminare il pacchetto ${bundle.name}?`);
        if (confirmed) {
            this.service.delete(bundle.id).subscribe(_ => this.search());
        }
    }

    private toggleDisabled(bundle: Bundle) {
        bundle.disabled = !bundle.disabled;
        this.service.put(bundle);
    }

    private modifyBundle(bundle: Bundle) {
        this.service.put(bundle).subscribe(_ => {
            const message = `Il pacchetto ${bundle.name} è stato modificato`;
            this.snackbar.open(message);
            this.search();
        });
    }
}
