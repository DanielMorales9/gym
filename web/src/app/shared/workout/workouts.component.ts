import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base-component';
import {QueryableDatasource, WorkoutHelperService} from '../../core/helpers';
import {Workout} from '../model';
import {WorkoutService} from '../../core/controllers';
import {PolicyService} from '../../core/policy';

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
        {name: 'Disattivo', value: true},
        {name: 'Attivo', value: false},
        {name: 'Entrambi', value: undefined}];
    filterName = 'disabled';
    selected = false;
    canCreate: boolean;
    canDelete: boolean;
    canEdit: boolean;

    constructor(private helper: WorkoutHelperService,
                private service: WorkoutService,
                private policy: PolicyService) {
        super();
        this.ds = new QueryableDatasource<Workout>(helper, this.pageSize, this.query);
    }

    ngOnInit(): void {
        this.canCreate = this.policy.get('workout', 'canCreate');
        this.canDelete = this.policy.get('workout', 'canDelete');
        this.canEdit = this.policy.get('workout', 'canEdit');
    }


    search($event: any) {
        return ;
    }

    handleEvent($event: any) {
        return ;
    }

    openDialog() {
        return ;
    }
}
