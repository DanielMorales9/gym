import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Bundle, BundleType} from '../model';
import {BundleModalComponent} from './bundle-modal.component';

@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
})
export class BundleItemComponent {

    @Input() bundle: any;
    @Input() canEdit: boolean;
    @Input() canDelete: boolean;

    @Output() done = new EventEmitter();

    PERSONAL = BundleType.PERSONAL;
    COURSE   = BundleType.COURSE;

    constructor(private dialog: MatDialog) {}

    getBundleType() {
        const defaultName = 'Allenamento Personale';
        let name;
        if (!this.bundle) { return name; }
        switch (this.bundle.type) {
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
        this.done.emit({type: 'info', bundle: this.bundle});
    }

    delete() {
        this.done.emit({type: 'delete', bundle: this.bundle});
    }

    edit() {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(res);
            if (res) {
                this.done.emit({type: 'edit', bundle: res});
            }
        });

    }
}
