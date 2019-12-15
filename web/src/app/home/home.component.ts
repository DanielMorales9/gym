import {Component, OnInit} from '@angular/core';
import {AppService, AuthenticatedService} from '../services';
import {User} from '../shared/model';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../styles/root.css', './home.component.css']
})
export class HomeComponent implements OnInit {

    user: User;
    authenticated = false;

    constructor(private authenticatedService: AuthenticatedService, private appService: AppService) { }

    ngOnInit() {
        // TODO check this problem
        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;
            this.user = this.appService.user;
        });

    }
}
