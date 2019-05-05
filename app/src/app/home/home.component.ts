import {Component, OnInit} from '@angular/core';
import {AuthenticatedService} from '../services';
import {User} from '../shared/model';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../styles/root.css']
})
export class HomeComponent implements OnInit {

    user: User;
    authenticated = false;

    constructor(private authenticatedService: AuthenticatedService) { }

    ngOnInit() {
        this.authenticatedService.getAuthenticated().subscribe(auth => {
            this.authenticated = auth;
        });

    }
}
