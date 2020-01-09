import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BundleSpecification} from '../../shared/model';
import {MatDialog} from '@angular/material';
import {BundleSpecModalComponent} from '../../shared/components/bundle-specs';


@Component({
    selector: 'bundle-spec-item',
    templateUrl: './bundle-spec-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
})
export class BundleSpecItemComponent {

    @Input() bundleSpec: any;

    @Output() done = new EventEmitter();

    PERSONAL = 'P';
    COURSE   = 'C';

    constructor(private dialog: MatDialog) {}

    openDialog(): void {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleSpecModalComponent, {
            data: {
                title: title,
                bundle: this.bundleSpec
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.done.emit({type: 'put', bundle: res});
            }
        });
    }

    deleteBundle() {
        this.done.emit({type: 'delete', bundle: this.bundleSpec});
    }

    toggleDisabled() {
        this.done.emit({type: 'patch', bundle: this.bundleSpec});
    }

    getBundleType() {
        const defaultName = 'Allenamento Personale';
        let name;
        if (!this.bundleSpec) { return name; }
        switch (this.bundleSpec.type) {
            case this.PERSONAL:
                name = defaultName;
                break;
            case this.COURSE:
                name = 'Corso';
                break;
            default:
                name = defaultName;
                break;
        }
        return name;
    }

    goToInfo() {
        this.done.emit({type: 'info', bundle: this.bundleSpec});
    }
}
