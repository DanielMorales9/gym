import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Bundle, BundleType, CourseBundle} from '../model';
import {BundleModalComponent} from './bundle-modal.component';
import {PolicyService} from "../../core/policy";

@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleItemComponent implements OnInit {

    @Input() bundle: Bundle;
    canEdit: boolean;
    canDelete: boolean;

    @Output() done = new EventEmitter();
    bundleType = BundleType;

    constructor(private dialog: MatDialog,
                private policy: PolicyService,
                private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.getPolicies()
    }

    getPolicies() {
        this.canDelete = this.policy.canDelete(this.bundle);
        this.canEdit = this.policy.canEdit(this.bundle);
    }

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
        return !!this.bundle && !!this.bundle.expiredAt;
    }

    isNotActive() {
        return !!this.bundle && !this.bundle.isActive();
    }

    isValid() {
        return !!this.bundle && !this.isExpired() && !this.isNotActive();
    }

    goToUserDetails() {
        this.done.emit({type: 'userInfo', user: this.bundle.customer});
    }

    get(property: string): any {
        if (!!this.bundle && property in this.bundle) return this.bundle[property];
        return undefined
    }


}
