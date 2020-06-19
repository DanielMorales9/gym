import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Session} from '../model/session.class';
import {BundleEntity, BundleType} from '../model';
import {PolicyService} from '../../core/policy';

@Component({
    selector: 'session-item',
    templateUrl: './session-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionItemComponent implements OnInit {

    @Input() session: Session;

    @Output() done = new EventEmitter();
    sessionType = BundleType;
    canAssignWorkout: boolean;

    constructor(private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private policyService: PolicyService) {
    }

    goToInfo() {
        this.done.emit({type: 'info', session: this.session});
    }

    assignWorkout() {
        this.done.emit({type: 'assign', session: this.session});
    }

    hasWorkout() {
        return !!this.session && this.session.workouts.length > 0;
    }

    ngOnInit(): void {
        setTimeout(() => {
            if (this.session) {
                this.canAssignWorkout =
                    this.policyService.get(BundleEntity[this.session.type], 'canAssignWorkout');
                this.cdr.detectChanges();
            }
        }, 1000);
    }
}
