import {QueryableDatasource, WorkoutHelperService} from '../../core/helpers';
import {Workout} from '../model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../base-component';
import {WorkoutService} from '../../core/controllers';
import {SnackBarService} from '../../core/utilities';
import {ActivatedRoute, Router} from '@angular/router';
import {first, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {Location} from '@angular/common';

@Component({
    templateUrl: './assign-workouts.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css']
})
export class AssignWorkoutsComponent extends BaseComponent implements OnInit, OnDestroy {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun Workout disponibile';

    sub: any;

    id: number;
    query: any;
    event: any;

    private pageSize = 10;
    selected: Map<number, boolean> = new Map<number, boolean>();

    ds: QueryableDatasource<Workout>;
    private queryParams: any;
    filters = [{name: 'Tutti', value: null}];
    filterName = 'tag';

    constructor(
        private helper: WorkoutHelperService,
        private service: WorkoutService,
        private snackbar: SnackBarService,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute) {
        super();
        this.ds = new QueryableDatasource<Workout>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.initQueryParams();
        this.getId();
        this.getTags();
    }

    private getId() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
        });
    }

    private getTags() {
        this.service.getTags()
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

    ngOnDestroy() {
        // this.destroy();
        super.ngOnDestroy();
    }


    search($event) {
        Object.keys($event).forEach(key => {
            if ($event[key] === undefined) {
                delete $event[key];
            }
            if ($event[key] === '') {
                delete $event[key];
            }
        });
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }

    confirmSession() {
        const selected = Object.keys(this.selected).map(key => {
            if (this.selected[key]) {
                return key;
            }
        }).filter(v => !!v);

        forkJoin(
            selected.map(workout => {
                return this.service.assign(this.id.toString(), workout)
                    .pipe( map( w => w));
            })
        ).subscribe(res => this.location.back(),
                err => this.snackbar.open(err.err.message));
    }

    selectWorkout(id: any) {
        this.selected[id] = !this.selected[id];
    }
}
