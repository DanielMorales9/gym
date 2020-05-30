import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    templateUrl: './calendar-controls.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarControlsComponent {

    constructor(protected router: Router,
                protected route: ActivatedRoute) {
    }

    goToView(view?) {
        const params = Object.assign({}, this.route.snapshot.queryParams);
        if (!!view) {
            params['view'] = view;
        }
        else {
            params['viewDate'] = new Date();
        }
        const url = this.router.url.split('?')[0];
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

}
