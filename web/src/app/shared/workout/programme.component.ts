import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SnackBarService} from '../../core/utilities';
import {AuthenticationService} from '../../core/authentication';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PolicyService} from '../../core/policy';
import {CalendarFacade} from '../../core/facades';
import {WorkoutModalComponent} from './workout-modal.component';
import {WorkoutService} from '../../core/controllers';
import {forkJoin} from 'rxjs';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {Location} from '@angular/common';
import {BaseComponent} from '../base-component';
import {BundleEntity, BundleType} from '../model';
import {GetPolicies} from '../policy.interface';


@Component({
    templateUrl: './programme.component.html',
    styleUrls: [
        '../../styles/search-list.css',
        '../../styles/details.css',
        '../../styles/root.css',
        '../../styles/card.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgrammeComponent extends BaseComponent implements GetPolicies, OnInit {

    session: any;
    users: any;

    canDelete: boolean;
    canDeleteWorkout: boolean;
    canEditWorkout: boolean;
    sessionType = BundleType;
    sessionEntity = BundleEntity;
    canAssignWorkout: boolean;

    constructor(private route: ActivatedRoute,
                private facade: CalendarFacade,
                private dialog: MatDialog,
                private router: Router,
                private location: Location,
                private auth: AuthenticationService,
                private snackBar: SnackBarService,
                private service: WorkoutService,
                private cdr: ChangeDetectorRef,
                private policy: PolicyService) {
        super();
    }

    ngOnInit(): void {
        const sessionId = +this.route.params
            .pipe(takeUntil(this.unsubscribe$),
                switchMap(r => this.facade.findSessionById(r['sessionId']))
            )
            .subscribe( r => {
                this.session = r;
                this.getPolicies();
                this.cdr.detectChanges();
            });
    }

    getPolicies() {
        this.canDeleteWorkout = this.policy.get('workout', 'canDelete');
        this.canEditWorkout = this.policy.get('workout', 'canEdit');
        this.canAssignWorkout = this.policy.get(this.sessionEntity[this.session.type], 'canAssignWorkout');
    }

    private findSessionById(sessionId: number) {
        this.facade.findSessionById(sessionId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.session = data;
                this.cdr.detectChanges();
            });
    }

    editWorkout(workout) {
        const title = 'Modifica Workout';

        const dialogRef = this.dialog.open(WorkoutModalComponent, {
            data: {
                title: title,
                workout: workout
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.service.patchWorkout(res)
                    .subscribe(_ => this.findSessionById(this.session.id),
                        err => this.snackBar.open(err.err.message));
            }
        });

    }

    deleteWorkout(workout) {
        this.service.deleteWorkoutFromSession(this.session.id, workout.id)
            .subscribe(res => {
                if (this.session.workouts.length > 1) {
                    this.findSessionById(this.session.id);
                }
                else {
                    this.location.back();
                }
            }, err => this.snackBar.open(err.err.message));
    }

    deleteProgramme() {
        forkJoin(
            this.session.workouts.map(workout => {
                return this.service.deleteWorkoutFromSession(this.session.id, workout.id)
                    .pipe( map( w => w));
            })
        ).subscribe(res => this.location.back(),
            err => this.snackBar.open(err.err.message));
    }

    assignWorkout() {
        console.log(this.route.parent.parent);
        this.router.navigate(['sessions', this.session.id, 'assignWorkout'],
            {relativeTo: this.route.parent.parent});
    }
}
