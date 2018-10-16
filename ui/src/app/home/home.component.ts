import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import {ChangeViewService} from "../services/change-view.service";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../app.component.css']
})
export class HomeComponent {

    user = null;
    current_role_view: number;

    constructor(private app: AppService,
                private changeViewService: ChangeViewService) {
        this.user = this.app.user;
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
    }

    authenticated() { return this.app.authenticated; }
}
