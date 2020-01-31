import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../core/authentication';
import {User} from '../shared/model';

@Component({
    templateUrl: './primary-customer-controls.component.html',
    styleUrls: ['../styles/root.css', '../styles/app.component.css'],
})
export class PrimaryCustomerControlsComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationService) {
    }

    ngOnInit(): void {
        this.user = this.auth.getUser();
    }


}
