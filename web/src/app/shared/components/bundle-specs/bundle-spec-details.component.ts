import {Component, OnInit} from '@angular/core';
import {BundleSpecsService} from '../../../core/controllers';
import {BundleSpecification} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {SpecFacade} from '../../../services';

@Component({
    selector: 'bundle-spec-details',
    templateUrl: './bundle-spec-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class BundleSpecDetailsComponent implements OnInit {

    bundleSpec: any;
    canDelete: boolean;
    canDisable: boolean;
    canEdit: boolean;

    PERSONAL = 'P';
    COURSE   = 'C';

    constructor(private service: BundleSpecsService,
                private dialog: MatDialog,
                private router: Router,
                private facade: SpecFacade,
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

        const dialogRef = this.dialog.open(BundleSpecModalComponent, {
            data: {
                title: title,
                bundle: this.bundleSpec
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.service.patch(res).subscribe((v: BundleSpecification) => this.bundleSpec = v);
            }
        });
    }

    deleteBundle() {
        const confirmed = confirm(`Vuoi eliminare il pacchetto ${this.bundleSpec.name}?`);
        if (confirmed) {
            this.service.delete(this.bundleSpec.id).subscribe(_ => this.router.navigateByUrl('/'));
        }
    }

    toggleDisabled() {
        this.bundleSpec.disabled = !this.bundleSpec.disabled;
        this.service.patch(this.bundleSpec);
    }

    private getBundle(id: number) {
        this.service.findById(id).subscribe((res: BundleSpecification) => {
            this.bundleSpec = res;
        });
    }

    getBundleType() {
        let name;
        if (!this.bundleSpec) { return name; }
        switch (this.bundleSpec.type) {
            case this.PERSONAL:
                name = 'Allenamento Personale';
                break;
            case this.COURSE:
                name = 'Corso';
                break;
            default:
                name = 'Allenamento Personale';
                break;
        }
        return name;
    }

    goToEditions() {
        this.router.navigate(['admin', 'bundles'],
            {queryParams: {
                    specId: this.bundleSpec.id
                }});
    }
}
