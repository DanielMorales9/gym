import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/controllers';
import {Subscription} from 'rxjs-compat/Subscription';
import {CalendarControlsComponent} from './calendar-controls.component';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

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


    ngOnInit(): void {
        const paths = this.router.url.split('/');
        const id = +paths[3].split('?')[0];

        if (!!id) {
            this.userService.findUserById(id)
                .subscribe(data => this.user = data,err => {
                    throw err;
                });
        }
    }

}
