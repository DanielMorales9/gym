import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {BundleType, BundleTypeConstant} from '../model';


@Component({
    selector: 'bundle-spec-item',
    templateUrl: './bundle-spec-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class BundleSpecItemComponent {

    COURSE   = BundleTypeConstant.COURSE;
    PERSONAL = BundleTypeConstant.PERSONAL;

    @Input() bundleSpec: any;
    @Input() canDelete: boolean;
    @Input() canDisable: boolean;

    bundleType = BundleType;

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

    goToInfo() {
        this.done.emit({type: 'info', bundleSpec: this.bundleSpec});
    }

}
