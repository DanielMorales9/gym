import {Component, OnInit} from '@angular/core';
import {BundlesService} from '../../../shared/services';
import {Bundle} from '../../../shared/model';
import {ActivatedRoute, Router} from '@angular/router';
import {BundleModalComponent} from './bundle-modal.component';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'bundle-details',
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class BundleDetailsComponent implements OnInit {

    public bundle: Bundle;

    constructor(private service: BundlesService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.getBundle(+params['id'])
        })
    }

    openDialog(): void {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            this.service.put(res).subscribe((res: Bundle) => this.bundle = res)
        });
    }

    deleteBundle() {
        let confirmed = confirm(`Vuoi eliminare il pacchetto ${this.bundle.name}?`);
        if (confirmed) {
            this.service.delete(this.bundle.id).subscribe(_ => this.router.navigateByUrl('/'))
        }
    }

    toggleDisabled() {
        this.bundle.disabled = !this.bundle.disabled;
        this.service.put(this.bundle);
    }

    private getBundle(id: number) {
        this.service.findById(id).subscribe((res: Bundle)=> {
            this.bundle = res;
        })
    }
}
