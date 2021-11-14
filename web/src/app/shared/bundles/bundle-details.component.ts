import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BundleService} from '../../core/controllers';
import {BundleModalComponent} from './bundle-modal.component';
import {Observable} from 'rxjs';
import {PolicyService} from '../../core/policy';
import {Bundle, BundleType} from '../model';
import {filter, first, map, switchMap, takeUntil} from 'rxjs/operators';
import {SnackBarService} from '../../core/utilities';
import {BaseComponent} from '../base-component';
import {Policy} from '../policy.interface';
import {toBundle} from "../mappers";

@Component({
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css', '../../styles/details.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleDetailsComponent extends BaseComponent implements Policy, OnInit, OnDestroy {
    bundleType = BundleType;

    bundle: Bundle;

    canEdit: boolean;
    canDelete: boolean;
    canShowWorkout: boolean;
    canEditWorkout: boolean;
    displayedSessionsColumns = ['date', 'time'];

    constructor(private service: BundleService,
                private dialog: MatDialog,
                private router: Router,
                private snackBar: SnackBarService,
                private policy: PolicyService,
                private cdr: ChangeDetectorRef,
                private route: ActivatedRoute,
                private snackbar: SnackBarService) {
        super();
    }

    ngOnInit(): void {
        this.route.params
            .pipe(first(),
                takeUntil(this.unsubscribe$),
                switchMap(params => this.getBundle(+params['id'])))
            .subscribe(d => {
                this.sortSessions(d);
                this.bundle = d;
                this.getPolicies();
                if (this.canShowWorkout) {
                    this.displayedSessionsColumns.push('workouts');
                }
                this.cdr.detectChanges();
            });
    }


    private sortSessions(d: Bundle) {
        d.sessions.sort((a, b) => {
            if (new Date(b.startTime) < new Date(a.startTime)) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    private getBundle(id: number): Observable<Bundle> {
        return this.service.findById(id).pipe(map(toBundle));
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
                switchMap(_ => this.getBundle(this.bundle.id))
            )
            .subscribe(v => {
                this.bundle = v;
                this.cdr.detectChanges();
            }, err => this.snackBar.open(err.error.message));
    }

    deleteBundle() {
        this.service.deleteBundle(this.bundle.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(_ => {
                this.router.navigateByUrl('/', {
                    replaceUrl: true,
                });
            }, err => this.snackbar.open(err.error.message));
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

    getPolicies() {
        this.canDelete = this.policy.canDelete(this.bundle);
        this.canEdit = this.policy.get('bundle', 'canEdit') && this.bundle.option.type != 'B';
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

    goToUserDetails() {
        this.router.navigate(['users', this.bundle.customer.id], {relativeTo: this.route.parent.parent});
    }

    get(property: string): any {
        if (!!this.bundle && property in this.bundle) return this.bundle[property];
        return undefined
    }
}
