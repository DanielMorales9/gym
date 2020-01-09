import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {MatDialog} from '@angular/material';
import {BundleModalComponent} from '../../shared/components/bundles';


@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
})
export class BundleItemComponent {

    @Input() bundle: any;

    @Output() done = new EventEmitter();

    PERSONAL = 'P';
    COURSE   = 'C';

    constructor(private dialog: MatDialog) {}

    openDialog(): void {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.done.emit({type: 'put', bundle: res});
            }
        });
    }

    deleteBundle() {
        this.done.emit({type: 'delete', bundle: this.bundle});
    }

    toggleDisabled() {
        this.done.emit({type: 'patch', bundle: this.bundle});
    }

    getBundleType() {
        let name;
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
