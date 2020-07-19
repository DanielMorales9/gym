import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BundleType, BundleTypeConstant} from '../model';
import {BundleModalComponent} from './bundle-modal.component';

@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleItemComponent {

    @Input() bundle: any;
    @Input() canEdit: boolean;
    @Input() canDelete: boolean;

    @Output() done = new EventEmitter();
    bundleType = BundleType;

    constructor(private dialog: MatDialog,
                private cdr: ChangeDetectorRef) {}

    goToInfo() {
        this.done.emit({type: 'info', bundle: this.bundle});
    }

    delete() {
        this.done.emit({type: 'delete', bundle: this.bundle});
    }

    edit() {
        const title = 'Modifica Date del Corso';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.done.emit({type: 'edit', bundle: res});
            }
        });

    }

    isExpired() {
        if (!!this.bundle) {
            return this.bundle.expiredAt;
        }
        return false;
    }

    isNotActive() {
        if (!!this.bundle) {
            if (this.bundle.type === 'C') {
                return !this.bundle.startTime;
            }
            else {
                return false;
            }
        }
        return false;
    }

    isValid() {
        if (!!this.bundle) {
            if (!this.isExpired()) {
                if (this.bundle.type === 'C') {
                    return !!this.bundle.startTime;
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    goToUserDetails() {
        this.done.emit({type: 'userInfo', user: this.bundle.customer});
    }
}
