import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bundle} from '../../../shared/model';
import {BundleModalComponent} from './bundle-modal.component';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css'],
})
export class BundleItemComponent {

    @Input() bundle: Bundle;

    @Output() done = new EventEmitter();

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
            this.done.emit({type: 'put', bundle: res});
        });
    }

    deleteBundle() {
        this.done.emit({type: 'delete', bundle: this.bundle});
    }

    toggleDisabled() {
        this.done.emit({type: 'patch', bundle: this.bundle});
    }
}
