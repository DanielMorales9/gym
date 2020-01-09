import {Component, OnInit} from '@angular/core';
import {Bundle} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {BundleService} from '../../../core/controllers';

@Component({
    selector: 'bundle-spec-details',
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class BundleDetailsComponent implements OnInit {

    bundle: any;

    PERSONAL = 'P';
    COURSE   = 'C';

    constructor(private service: BundleService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.getBundle(+params['id']);
        });
    }

    private getBundle(id: number) {
        this.service.findById(id).subscribe((res: Bundle) => {
            this.bundle = res;
        });
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
}
