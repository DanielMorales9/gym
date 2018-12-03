import {Component, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {ChangeViewService} from "../services/change-view.service";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../app.component.css']
})
export class HomeComponent implements OnInit {

    user = null;
    current_role_view: number;
    authenticated: boolean = false;

    constructor(private app: AppService,
                private changeViewService: ChangeViewService) { }

    ngOnInit() :void {
        this.user = this.app.user;
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
        this.authenticate()
    }

    authenticate() {
        this.app.authenticate(undefined, (isAuthenticated) => {
            this.authenticated = isAuthenticated
        }, err => {
            console.log(err)
        });
    }
}
