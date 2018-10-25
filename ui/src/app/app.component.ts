import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/finally';
import {AppService} from "./core/services/app.service";
import {ChangeViewService} from "./core/services/change-view.service";
import {MessageService} from "./core/services/message.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    current_role_view: number;
    user: any;
    roles: any[];
    authenticated: boolean;

    constructor(private app: AppService,
                private router: Router,
                private changeViewService: ChangeViewService,
                private messageService: MessageService) {

    }

    ngOnInit(): void {

        this.router.events.subscribe(event => {
            if(event instanceof NavigationStart) {
                this.app.authenticate(undefined, (isAuthenticated) => {
                    if (isAuthenticated) {
                        this.current_role_view = this.app.current_role_view;
                        this.roles = this.app.roles;
                    }
                    this.authenticated = isAuthenticated;
                }, undefined);
            }
        });

        this.handleMessage();
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    handleMessage() {
        this.messageService.getMessage().subscribe((mess) => {
            let node = document.createElement("div");
            node.className = "alert " + mess.class;
            node.innerText = mess.text;
            let delay = mess.delay || 10000;
            node.addEventListener('click', function() {
                node.remove()
            }, false);
            document.getElementById('notifications').appendChild(node);
            setTimeout(function() {
                node.remove()
            }, delay);
        });
    }

    logout() {
        this.app.logout( () => {
            this.current_role_view = undefined;
            this.roles = undefined;
            this.router.navigateByUrl("/login")
        })
    }


    switchView(role) {
        this.app.changeView(role);
    }

    hasMoreThanOneRole() {
        return this.roles && this.roles.length > 1;
    }
}