import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/controllers';
import {Subscription} from 'rxjs-compat/Subscription';
import {CalendarControlsComponent} from './calendar-controls.component';

@Component({
    templateUrl: './calendar-customer-controls.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/app.component.css'],
})
export class CalendarCustomerControlsComponent extends CalendarControlsComponent implements OnInit {
    user: User;
    private sub: Subscription;

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private userService: UserService) {
        super(router, route);
    }


    async ngOnInit(): Promise<void> {
        const paths = this.router.url.split('/');
        const id = +paths[3].split('?')[0];

        if (!!id) {
            const [data, error] = await this.userService.findById(id);
            if (error) {
                throw error;
            }
            this.user = data;
        }
    }

}
