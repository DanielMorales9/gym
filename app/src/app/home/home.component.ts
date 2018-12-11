import {Component, OnInit} from '@angular/core';
import {AppService} from "../services";
import {ChangeViewService} from "../services";
import {User} from "../shared/model";
import {Router} from "@angular/router";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../app.component.css']
})
export class HomeComponent implements OnInit {

    user: User;
    current_role_view: number;
    authenticated: boolean = false;

    constructor(private app: AppService,
                private router: Router,
                private changeViewService: ChangeViewService) { }

    ngOnInit() :void {
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
        this.authenticate()
    }

    authenticate() {
        this.app.authenticate(undefined, (isAuthenticated) => {
            this.current_role_view = this.app.current_role_view;
            this.authenticated = isAuthenticated;
            if (this.authenticated) this.user = this.app.user;
        });
    }

}
