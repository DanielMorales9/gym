import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {BundleService} from '../../../core/controllers';
import {BundleModalComponent} from './bundle-modal.component';
import {Subscription} from 'rxjs';
import {PolicyService} from '../../../core/policy';
import {BundleType} from '../../model';

@Component({
    selector: 'bundle-spec-details',
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class BundleDetailsComponent implements OnInit, OnDestroy {

    PERSONAL = BundleType.PERSONAL;
    COURSE   = BundleType.COURSE;

    bundle: any;
    private sub: Subscription;

    canEdit: boolean;
    canDelete: boolean;

    constructor(private service: BundleService,
                private dialog: MatDialog,
                private router: Router,
                private policy: PolicyService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(async params => {
            await this.getBundle(+params['id']);
            this.getPolicies();
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private async getBundle(id: number) {
        const [data, error] = await this.service.findById(id);
        if (error) { throw error; }
        this.bundle = data;
    }

    getBundleType() {
        let name;
        if (!this.bundle) { return name; }
        switch (this.bundle.type) {
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

    edit() {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(async res => {
            if (res) {
                await this.editBundle(res);
            }
        });
    }

    async delete() {
        const [data, error] = await this.service.delete(this.bundle.id);
        if (error) {
            throw error;
        }
        await this.router.navigateByUrl('/');
    }

    private async editBundle(res: any) {
        const [data, error] = await this.service.patch(this.bundle);
        if (error) {
            throw error;
        }
        await this.getBundle(this.bundle.id);
    }

    async goToBundleSPec() {
        await this.router.navigate(['bundleSpecs', this.bundle.bundleSpec.id],
            {relativeTo: this.route.parent});
    }

    private getPolicies() {
        this.canDelete = this.policy.get('bundle', 'canDelete') && this.bundle.deletable;
        this.canEdit = this.policy.get('bundle', 'canEdit');
    }
}
