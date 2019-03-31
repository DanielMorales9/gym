import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Bundle} from '../../../shared/model';
import {BundleModalComponent} from './bundle-modal.component';
import {MatDialog} from '@angular/material';
import {BundlesService} from '../../../shared/services';


@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../../search-and-list.css', '../../../root.css'],
})
export class BundleItemComponent {

    @Input() bundle: Bundle;

    @Output() done = new EventEmitter();

    constructor(private dialog: MatDialog,
                private service: BundlesService) {
    }

    openDialog(): void {
        const title = 'Modifica Pacchetto';
        const message = 'è stato modificato';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                message: message,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(_ => {
            this.done.emit();
        });
    }

    deleteBundle() {
        let confirmed = confirm(`Vuoi eliminare il pacchetto ${this.bundle.name}?`);
        if (confirmed) {
            this.service.delete(this.bundle.id).subscribe(_ => this.done.emit())
        }
    }

    toggleDisabled() {
        this.bundle.disabled = !this.bundle.disabled;
        this.service.put(this.bundle);
    }
}
