import {Component, OnInit} from '@angular/core';
import {BundlesService} from '../../services';
import {Bundle} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {BundleModalComponent} from './bundle-modal.component';
import {BundleFacade} from '../../../services';

@Component({
    selector: 'bundle-details',
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class BundleDetailsComponent implements OnInit {

    bundle: Bundle;
    canDelete: boolean;
    canDisable: boolean;
    canEdit: boolean;

    constructor(private service: BundlesService,
                private dialog: MatDialog,
                private router: Router,
                private facade: BundleFacade,
                private route: ActivatedRoute) {
        this.canDelete = facade.canDelete();
        this.canEdit = facade.canEdit();
        this.canDisable = facade.canDisable();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.getBundle(+params['id']);
        });
    }

    editBundle(): void {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.service.patch(res).subscribe((v: Bundle) => this.bundle = v);
            }
        });
    }

    deleteBundle() {
        const confirmed = confirm(`Vuoi eliminare il pacchetto ${this.bundle.name}?`);
        if (confirmed) {
            this.service.delete(this.bundle.id).subscribe(_ => this.router.navigateByUrl('/'));
        }
    }

    toggleDisabled() {
        this.bundle.disabled = !this.bundle.disabled;
        this.service.patch(this.bundle);
    }

    private getBundle(id: number) {
        this.service.findById(id).subscribe((res: Bundle) => {
            this.bundle = res;
        });
    }
}
