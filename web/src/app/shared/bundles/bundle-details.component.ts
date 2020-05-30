import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {BundleService} from '../../core/controllers';
import {BundleModalComponent} from './bundle-modal.component';
import {Observable} from 'rxjs';
import {PolicyService} from '../../core/policy';
import {BundleType} from '../model';
import {filter, first, switchMap, takeUntil} from 'rxjs/operators';
import {SnackBarService} from '../../core/utilities';
import {BaseComponent} from '../base-component';

@Component({
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css', '../../styles/details.css'],
})
export class BundleDetailsComponent extends BaseComponent implements OnInit, OnDestroy {

    PERSONAL = BundleType.PERSONAL;
    COURSE   = BundleType.COURSE;

    bundle: any;

    canEdit: boolean;
    canDelete: boolean;
    canShowWorkout: boolean;
    canEditWorkout: boolean;
    displayedSessionsColumns = ['index', 'date', 'time'];

    constructor(private service: BundleService,
                private dialog: MatDialog,
                private router: Router,
                private snackBar: SnackBarService,
                private policy: PolicyService,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.route.params
            .pipe(first(),
            takeUntil(this.unsubscribe$),
                switchMap(params => this.getBundle(+params['id'])))
            .subscribe(d => {
                this.bundle = d;
                this.getPolicies();
                if (this.canShowWorkout) {
                    this.displayedSessionsColumns.push('workouts');
                }
            });
    }


    private getBundle(id: number): Observable<any> {
        return this.service.findById(id);
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

    getBundleType() {
        let name;
        if (!this.bundle) { return name; }
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

    edit() {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleModalComponent, {
            data: {
                title: title,
                bundle: this.bundle
            }
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(v => this.editBundle(v)),
                switchMap(v => this.getBundle(this.bundle.id))
            )
            .subscribe(v => this.bundle = v,
                err => this.snackBar.open(err.error.message));
    }

    deleteBundle() {
        this.service.deleteBundle(this.bundle.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
                this.router.navigateByUrl('/', {
                    replaceUrl: true,
                });
            });
    }

    private editBundle(res: any): Observable<any> {
        return this.service.patchBundle(this.bundle);
    }

    goToBundleSPec() {
        this.router.navigate(['bundleSpecs', this.bundle.bundleSpec.id],
            {
                replaceUrl: true,
                relativeTo: this.route.parent
            });
    }

    private getPolicies() {
        this.canDelete = this.policy.get('bundle', 'canDelete') && this.bundle.deletable;
        this.canEdit = this.policy.get('bundle', 'canEdit');
        this.canShowWorkout = this.policy.get('workout', 'canShow');
        this.canEditWorkout = this.policy.get('workout', 'canEdit');
    }


    hasWorkout(session) {
        if (!!session && session.type === 'P') {
            return session.workouts.length > 0;
        }
        return false;
    }

    assignWorkout(sessionId: number) {
        this.router.navigate(['sessions', sessionId, 'assignWorkout'], {relativeTo: this.route.parent.parent});
    }


    goToWorkout(sessionId: number) {
        this.router.navigate(['sessions', sessionId, 'programme'], {relativeTo: this.route.parent.parent});
    }

}
