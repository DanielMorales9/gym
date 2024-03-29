import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {WorkoutService} from '../../core/controllers';
import {Workout} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {PolicyServiceDirective} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {WorkoutModalComponent} from './workout-modal.component';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {of} from 'rxjs';
import {BaseComponent} from '../base-component';
import {GetPolicies} from '../policy.interface';

@Component({
    templateUrl: './workout-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutDetailsComponent extends BaseComponent implements GetPolicies, OnInit {

    workout: Workout;

    canDelete: boolean;
    canEdit: boolean;

    constructor(private service: WorkoutService,
                private dialog: MatDialog,
                private router: Router,
                private policy: PolicyServiceDirective,
                private snackBar: SnackBarService,
                private cdr: ChangeDetectorRef,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.getPolicies();

        this.route.params
            .pipe(takeUntil(this.unsubscribe$),
                switchMap(p => this.service.findWorkoutById(+p['id'])))
            .subscribe( (params: Workout) => {
                this.workout = params;
                this.cdr.detectChanges();
            });
    }

    getPolicies() {
        this.canDelete = this.policy.get('workout', 'canDelete');
        this.canEdit = this.policy.get('workout', 'canEdit');
    }

    editBundleSpec(): void {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(WorkoutModalComponent, {
            data: {
                title: title,
                workout: this.workout
            }
        });

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(v => this.service.patchWorkout(v)))
            .subscribe((res: Workout) => this.workout = res);
    }

    deleteBundle() {
        of(confirm(`Vuoi eliminare il workout ${this.workout.name}?`))
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(a => !!a),
                switchMap(v => this.service.deleteWorkout(this.workout.id))
            )
            .subscribe(_ =>
                this.router.navigateByUrl('/', {
                    replaceUrl: true
                }));
    }

}
