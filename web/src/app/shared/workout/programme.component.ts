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
import {map} from 'rxjs/operators';
import {Location} from '@angular/common';


@Component({
    templateUrl: './programme.component.html',
    styleUrls: [
        '../../styles/search-list.css',
        '../../styles/details.css',
        '../../styles/root.css',
        '../../styles/card.css'
    ],
})
export class ProgrammeComponent implements OnInit {

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
    }

    async ngOnInit(): Promise<void> {
        const id = +this.route.snapshot.params['id'];
        await this.findById(id);
        this.getPolicy();

    }

    private getPolicy() {
        this.canDeleteWorkout = this.policy.get('workout', 'canDelete');
        this.canEditWorkout = this.policy.get('workout', 'canEdit');
    }

    private async findById(id: number) {
        const [data, error] = await this.facade.findEventById(id);
        if (error) {
            throw error;
        }
        this.event = data;
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
                this.service.patch(res)
                    .subscribe(_ => this.findById(this.event.id),
                        err => this.snackBar.open(err.err.message));
            }
        });

    }

    deleteWorkout(workout) {
        this.service.deleteFromEvent(this.event.id, workout.id)
            .subscribe(res => {
                if (this.event.session.workouts.length > 1) {
                    this.findById(this.event.id);
                }
                else {
                    this.location.back();
                }
            }, err => this.snackBar.open(err.err.message));
    }

    deleteProgramme() {
        forkJoin(
            this.event.session.workouts.map(workout => {
                return this.service.deleteFromEvent(this.event.id.toString(), workout.id)
                    .pipe( map( w => w));
            })
        ).subscribe(res => this.location.back(),
            err => this.snackBar.open(err.err.message));
    }
}
