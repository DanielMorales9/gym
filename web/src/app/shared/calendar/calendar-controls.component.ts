import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PolicyService} from '../../core/policy';
import {BaseComponent} from '../base-component';

@Component({
    templateUrl: './calendar-controls.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarControlsComponent extends BaseComponent implements OnInit {

    canShowCourse: boolean;
    canShowPersonal: boolean;
    canShowTimeOff: boolean;
    canShowHoliday: boolean;

    view: string;

    selectedEventTypes = {
        'P': false,
        'C': false,
        'H': false,
        'T': false,
    };

    constructor(protected router: Router,
                protected policyService: PolicyService,
                protected cdr: ChangeDetectorRef,
                protected route: ActivatedRoute) {
        super();
    }

    ngOnInit(user?) {
        this.canShowCourse = this.policyService.get('events', 'canShowCourse');
        this.canShowPersonal = this.policyService.get('events', 'canShowPersonal');
        this.canShowTimeOff = this.policyService.get('events', 'canShowTimeOff') && !user;
        this.canShowHoliday = this.policyService.get('events', 'canShowHoliday');

        this.route.queryParams.subscribe(params => {
            let typeNames = params['types'];
            if (!typeNames) {
                this.selectedEventTypes['P'] = this.canShowPersonal;
                this.selectedEventTypes['C'] = this.canShowCourse;
                this.selectedEventTypes['H'] = this.canShowHoliday;
                this.selectedEventTypes['T'] = this.canShowTimeOff;

            } else {
                if (!Array.isArray(typeNames)) {
                    typeNames = [typeNames];
                }
                typeNames.forEach(v => this.selectedEventTypes[v] = true);
            }
        });
    }

    goToView(view?, types?) {
        this.view = view;
        const params = Object.assign({}, this.route.snapshot.queryParams);
        if (!!view) {
            params['view'] = view;
        }
        else {
            params['viewDate'] = new Date();
        }

        if (!!types) {
            params['types'] = types;
        }

        const url = this.router.url.split('?')[0];
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    changeEvent($event, p: string) {
        this.selectedEventTypes[p] = $event.checked;
        const types = this.getEventTypes();
        this.goToView(this.view, types);
    }

    getEventTypes() {
        const array = [];
        for (const key in this.selectedEventTypes) {
            if (this.selectedEventTypes[key]) {
                array.push(key);
            }
        }
        return array;
    }
}
