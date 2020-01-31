import {Component, OnInit} from '@angular/core';
import {AuthenticatedService} from '../services';
import {User} from '../shared/model';
import {AuthenticationService} from '../core/authentication';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../styles/root.css', '../styles/home.component.css']
})
export class HomeComponent implements OnInit {

    user: User;
    authenticated = false;

    constructor(private authenticatedService: AuthenticatedService,
                private auth: AuthenticationService) { }

    ngOnInit() {
        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;
            this.user = this.auth.getUser();
        });

    }
}
