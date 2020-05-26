import {Component, OnInit} from '@angular/core';
import {SnackBarService} from '../../core/utilities';
import {AuthenticationService} from '../../core/authentication';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PolicyService} from '../../core/policy';
import {CalendarFacade} from '../../core/facades';
import {WorkoutModalComponent} from './workout-modal.component';
import {WorkoutService} from '../../core/controllers';
import {forkJoin} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {Location} from '@angular/common';
import {BaseComponent} from '../base-component';


@Component({
    templateUrl: './programme.component.html',
    styleUrls: [
        '../../styles/search-list.css',
        '../../styles/details.css',
        '../../styles/root.css',
        '../../styles/card.css'
    ],
})
export class ProgrammeComponent extends BaseComponent implements OnInit {

    event: any;
    users: any;

    EVENT_TYPES = {
        P: 'Allenamento Personale',
        C: 'Corso',
        H: 'Chiusura',
        T: 'Ferie',
    };

    canDelete: boolean;
    canDeleteWorkout: boolean;
    canEditWorkout: boolean;

    constructor(private route: ActivatedRoute,
                private facade: CalendarFacade,
                private dialog: MatDialog,
                private router: Router,
                private location: Location,
                private auth: AuthenticationService,
                private snackBar: SnackBarService,
                private service: WorkoutService,
                private policy: PolicyService) {
        super();
    }

    ngOnInit(): void {
        const id = +this.route.snapshot.params['id'];
        const sessionId = +this.route.snapshot.params['sessionId'];
        this.findEventById(id);
        this.getPolicy();

    }

    private getPolicy() {
        this.canDeleteWorkout = this.policy.get('workout', 'canDelete');
        this.canEditWorkout = this.policy.get('workout', 'canEdit');
    }

    private findEventById(id: number) {
        this.facade.findEventById(id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => this.event = data);
    }

    getType() {
        if (!!this.event) {
            return this.EVENT_TYPES[this.event.type];
        }
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
                    .subscribe(_ => this.findEventById(this.event.id),
                        err => this.snackBar.open(err.err.message));
            }
        });

    }

    deleteWorkout(workout) {
        this.service.deleteWorkoutFromEvent(this.event.id, workout.id)
            .subscribe(res => {
                if (this.event.session.workouts.length > 1) {
                    this.findEventById(this.event.id);
                }
                else {
                    this.location.back();
                }
            }, err => this.snackBar.open(err.err.message));
    }

    deleteProgramme() {
        forkJoin(
            this.event.session.workouts.map(workout => {
                return this.service.deleteWorkoutFromEvent(this.event.id.toString(), workout.id)
                    .pipe( map( w => w));
            })
        ).subscribe(res => this.location.back(),
            err => this.snackBar.open(err.err.message));
    }
}
