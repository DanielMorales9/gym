import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {QueryableDatasource, WorkoutHelperService} from '../../core/helpers';
import {Workout} from '../model';
import {WorkoutService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';
import {MatDialog} from '@angular/material/dialog';
import {WorkoutModalComponent} from './workout-modal.component';
import {SnackBarService} from '../../core/utilities';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchComponent} from '../search-component';

@Component({
    templateUrl: './workouts.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutsComponent extends SearchComponent<Workout> implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun workout disponibile';

    query: any = {};

    filters = [
        {name: 'Tutti', value: null}
    ];

    filterName = 'tag';
    selected = false;
    canCreate: boolean;
    canDelete: boolean;
    canEdit: boolean;

    constructor(private helper: WorkoutHelperService,
                private service: WorkoutService,
                private dialog: MatDialog,
                protected route: ActivatedRoute,
                protected router: Router,
                private snackbar: SnackBarService,
                private policy: PolicyService) {
        super(router, route);
        this.ds = new QueryableDatasource<Workout>(helper, this.query);
    }

    ngOnInit(): void {
        this.getTags();
        this.initQueryParams();
        this.canCreate = this.policy.get('workout', 'canCreate');
        this.canDelete = this.policy.get('workout', 'canDelete');
        this.canEdit = this.policy.get('workout', 'canEdit');
    }

    private getTags() {
        this.service.getWorkoutTags()
            .subscribe(res => {
                if (res) {
                    res = res.map(v => new Object({value: v, name: v}));
                }
                this.filters.push(...res);
            });
    }

    protected initDefaultQueryParams(params: any): any {
        params.isTemplate = true;
        return params;
    }

    protected enrichQueryParams($event?): any {
        $event.isTemplate = true;
        return $event;
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteWorkout($event.workout.id);
                break;
            case 'patch':
                this.editWorkout($event.workout);
                break;
            case 'info':
                this.goToDetails($event.workout);
                break;
            default:
                break;
        }
    }

    openDialog() {
        const title = 'Crea Nuovo Workout';

        const dialogRef = this.dialog.open(WorkoutModalComponent, {
            data: {
                title: title,
            }
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) { this.createWorkout(data); }
        });
    }

    private createWorkout(w: Workout) {
        delete w.id;
        this.service.postWorkout(w).subscribe(_ => {
            const message = `Il workout ${w.name} è stato creato`;
            this.snackbar.open(message);
            this.search({isTemplate: true});
        }, err => this.snackbar.open(err.error.message));
    }

    private deleteWorkout(id: any) {
        this.service.deleteWorkout(id).subscribe(_ => {
            const message = `Il workout è stato cancellato`;
            this.snackbar.open(message);
            this.search({isTemplate: true});
        }, err => this.snackbar.open(err.error.message));
    }

    private editWorkout(w: any) {
        this.service.patchWorkout(w).subscribe(_ => {
            const message = `Il workout ${w.name} è stato modificato`;
            this.snackbar.open(message);
            this.search({isTemplate: true});
        }, err => this.snackbar.open(err.error.message));
    }

    private goToDetails(workout: any) {
        this.router.navigate(['./', workout.id], {relativeTo: this.route});
    }

    trackBy(index, item) {
        return item ? item.id : index;
    }
}
