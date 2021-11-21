import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationDirective} from '../core';
import {User} from '../shared/model';
import {BaseComponent} from '../shared/base-component';

@Component({
    templateUrl: './primary-customer-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryCustomerControlsComponent extends BaseComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationDirective) {
        super();
    }

    ngOnInit(): void {
        this.user = this.auth.getUser();
    }


}
