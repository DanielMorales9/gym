import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../core/services/notification.service";
import {ChangeViewService} from "../../core/services/change-view.service";
import {UserService} from "../../core/services/users.service";
import {AppService} from "../../core/services/app.service";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../../app.component.css'],
})
export class ProfileComponent implements OnInit {

    current_role_view: number;
    sub: any;
    id : number;
    roles: string[];
    email: string;

    constructor(private app: AppService,
                private userService: UserService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService,
                private route: ActivatedRoute) {
        this.current_role_view = this.app.current_role_view;
        this.email = this.app.user.email;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    _systemError() {
        return err => {
            console.log(err);
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    private getRoles(user) {
        this.userService.getRoles(user.id).subscribe(res => {
            this.roles = res['_embedded']['roles'];
        }, this._systemError())
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id?'];
            console.log(params);
            if (this.id) {
                this.getRoles({ id: this.id });
            }
            else {
                this.app.getFullUser(res => {
                    this.id = res.id;
                    if (!res['roles']) {
                        this.getRoles(res);
                    }
                    else {
                        this.roles = res['roles']['_embedded']['roleResources']
                    }
                }, this.app._systemError())
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}