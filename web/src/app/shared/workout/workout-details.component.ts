import {Component, OnInit} from '@angular/core';
import {WorkoutService} from '../../core/controllers';
import {Workout} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {PolicyService} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {WorkoutModalComponent} from './workout-modal.component';

@Component({
    templateUrl: './workout-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
})
export class WorkoutDetailsComponent implements OnInit {

    workout: Workout;

    canDelete: boolean;
    canEdit: boolean;

    constructor(private service: WorkoutService,
                private dialog: MatDialog,
                private router: Router,
                private policy: PolicyService,
                private snackBar: SnackBarService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.getPolicies();

        this.route.params.subscribe(async params => {
            await this.getWorkout(+params['id']);
        });
    }

    private getPolicies() {
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

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.service.patch(res).subscribe((v: any) => this.workout = v);
            }
        });
    }

    deleteBundle() {
        const confirmed = confirm(`Vuoi eliminare il workout ${this.workout.name}?`);
        if (confirmed) {
            this.service.delete(this.workout.id).subscribe(_ =>
                this.router.navigateByUrl('/', {
                    replaceUrl: true
                }));
        }
    }

    private getWorkout(id: number) {
        this.service.findById(id).subscribe(res => this.workout = res);
    }
}
