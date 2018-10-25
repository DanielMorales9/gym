import {Component, OnInit} from "@angular/core";
import {User} from "../../core/model/user.class";
import {ChangeViewService} from "../../core/services/change-view.service";
import {AppService} from "../../core/services/app.service";
import {ActivatedRoute} from "@angular/router";
import {ExchangeUserService} from "../../core/services/exchange-user.service";
import {UserService} from "../../core/services/users.service";
import {MessageService} from "../../core/services/message.service";
@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['../../app.component.css'],
})
export class UserProfileComponent implements OnInit {

    user: User;
    roles: string[];
    sales: any[];
    empty = false;

    id: number;
    private sub: any;
    current_role_view: number;
    email: string;

    constructor(private messageService: MessageService,
                private service: UserService,
                private route: ActivatedRoute,
                private app: AppService,
                private changeViewService: ChangeViewService,
                private exchangeService: ExchangeUserService) {
        this.current_role_view = this.app.current_role_view;
        this.email = this.app.user.email;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    //TODO Refactor this piece of common code: use a service instead
    getUserCreatedAt() {
        let date = new Date(this.user.createdAt);
        return date.toLocaleDateString();
    }

    ngOnInit(): void {
        this.sub = this.route.parent.params.subscribe(params => {
            this.id = +params['id?'];
            this.updateUser()
        })
    }

    updateUser() {
        let closure = (res=> {
            this.user = res;
            this.service.getRoles(this.user.id).subscribe(res1 => {
                    this.roles = res1['_embedded']['roles'].map(i => i.name.toLowerCase());
                }, this._error());
        });

        if (this.id) {
            this.service.findById(this.id).subscribe(closure, this._error());
        }
        else {
            this.service.findByEmail(this.email).subscribe(closure, this._error());
        }
    }

    _error() {
        return err => {
            let message = {
                text: "Qualcosa è andato storto",
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    editUser() {
        this.exchangeService.sendUser(this.user);
    }
}