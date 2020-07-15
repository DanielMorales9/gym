import {QueryableDatasource, WorkoutHelperService} from '../../core/helpers';
import {Workout} from '../model';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {WorkoutService} from '../../core/controllers';
import {SnackBarService} from '../../core/utilities';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {Location} from '@angular/common';
import {SearchComponent} from '../search-component';

@Component({
    templateUrl: './assign-workouts.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignWorkoutsComponent extends SearchComponent<Workout> implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun Workout disponibile';

    sub: any;
    query: any;

    selected: Map<number, boolean> = new Map<number, boolean>();

    filters = [{name: 'Tutti', value: null}];
    filterName = 'tag';
    private sessionId: number;

    constructor(private helper: WorkoutHelperService,
                private service: WorkoutService,
                private snackbar: SnackBarService,
                protected router: Router,
                private location: Location,
                protected route: ActivatedRoute) {
        super(router, route);
        this.ds = new QueryableDatasource<Workout>(helper, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
        this.getId();
        this.getTags();
    }

    private getId() {
        this.sub = this.route.params.subscribe(params => {
            this.sessionId = +params['sessionId'];
        });
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

    protected enrichQueryParams(params: any): any {
        params.isTemplate = true;
        return params;
    }

    ngOnDestroy() {
        // this.destroy();
        super.ngOnDestroy();
    }

    confirmSession() {
        const selected = Object.keys(this.selected).map(key => {
            if (this.selected[key]) {
                return key;
            }
        }).filter(v => !!v);

        forkJoin(
            selected.map(workout => {
                return this.service.assignWorkout(this.sessionId.toString(), workout)
                    .pipe( map( w => w));
            })
        ).subscribe(res => this.location.back(),
            err => this.snackbar.open(err.err.message));
    }

    selectWorkout(id: any) {
        this.selected[id] = !this.selected[id];
    }
}
