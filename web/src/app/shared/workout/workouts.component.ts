import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base-component';
import {QueryableDatasource, WorkoutHelperService} from '../../core/helpers';
import {Workout} from '../model';
import {WorkoutService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';
import {MatDialog} from '@angular/material/dialog';
import {WorkoutModalComponent} from './workout-modal.component';
import {SnackBarService} from '../../core/utilities';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    templateUrl: './workouts.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class WorkoutsComponent extends BaseComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun workout disponibile';

    query: any = {};
    private queryParams: any;

    private pageSize = 10;
    ds: QueryableDatasource<Workout>;

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
                private route: ActivatedRoute,
                private router: Router,
                private snackbar: SnackBarService,
                private policy: PolicyService) {
        super();
        this.ds = new QueryableDatasource<Workout>(helper, this.pageSize, this.query);
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

    private initQueryParams() {
        this.route.queryParams.pipe(first()).subscribe(params => {
            this.queryParams = Object.assign({}, params);
            this.queryParams.isTemplate = true;
            this.search(this.queryParams);
        });
    }

    private updateQueryParams($event) {
        if (!$event) { $event = {isTemplate: true}; }

        this.queryParams = this.query = $event;
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    search($event?) {
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
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
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }

    private deleteWorkout(id: any) {
        this.service.deleteWorkout(id).subscribe(_ => {
            const message = `Il workout è stato cancellato`;
            this.snackbar.open(message);
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }

    private editWorkout(w: any) {
        this.service.patchWorkout(w).subscribe(_ => {
            const message = `Il workout ${w.name} è stato modificato`;
            this.snackbar.open(message);
            this.search();
        }, err => this.snackbar.open(err.error.message));
    }

    private goToDetails(workout: any) {
        this.router.navigate(['./', workout.id], {relativeTo: this.route});
    }
}
