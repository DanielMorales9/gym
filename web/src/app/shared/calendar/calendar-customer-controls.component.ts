import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/controllers';
import {Subscription} from 'rxjs-compat/Subscription';
import {CalendarControlsComponent} from './calendar-controls.component';
import {PolicyService} from '../../core/policy';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './calendar-customer-controls.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarCustomerControlsComponent extends CalendarControlsComponent implements OnInit {
    user: User;

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                protected policy: PolicyService,
                protected cdr: ChangeDetectorRef,
                private userService: UserService) {
        super(router, policy, cdr, route);
    }


    ngOnInit(): void {
        super.ngOnInit(true);
        const paths = this.router.url.split('/');
        const id = +paths[3].split('?')[0];

        if (!!id && !this.user) {
            this.userService.findUserById(id)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(data => {
                    this.user = data;
                    this.cdr.detectChanges();
                });
        }
    }

}
