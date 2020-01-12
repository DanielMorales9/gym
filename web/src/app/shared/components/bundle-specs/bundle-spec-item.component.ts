import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {BundleType} from '../../model';


@Component({
    selector: 'bundle-spec-item',
    templateUrl: './bundle-spec-item.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css'],
})
export class BundleSpecItemComponent {

    COURSE   = BundleType.COURSE;
    PERSONAL = BundleType.PERSONAL;

    @Input() bundleSpec: any;
    @Input() canDelete: boolean;
    @Input() canDisable: boolean;
    @Input() canShowEditions: boolean;

    @Output() done = new EventEmitter();
    constructor(private dialog: MatDialog) {
    }


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

    deleteBundleSpec() {
        this.done.emit({type: 'delete', bundleSpec: this.bundleSpec});
    }

    toggleDisabled() {
        this.done.emit({type: 'patch', bundleSpec: this.bundleSpec});
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
        this.done.emit({type: 'info', bundleSpec: this.bundleSpec});
    }

    // goToEditions() {
    //     this.done.emit({type: 'list', bundleSpec: this.bundleSpec});
    // }

}
