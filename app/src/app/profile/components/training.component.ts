import {Component, OnInit, } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { BundlesService, UserService} from "../../shared/services";
import {AppService} from "../../services/app.service";
import {ChangeViewService, NotificationService} from "../../services";

@Component({
    templateUrl: './training.component.html',
    styleUrls: ['../../app.component.css']
})
export class TrainingComponent implements OnInit {

    user: any;
    roles: string[];
    sales: any[];
    empty = false;

    id: number;
    private sub: any;
    current_role_view: number;
    email: string;

    constructor(private messageService: NotificationService,
                private userService: UserService,
                private bundleService: BundlesService,
                private route: ActivatedRoute,
                private router: Router,
                private app: AppService,
                private changeViewService: ChangeViewService) {
        this.current_role_view = this.app.current_role_view;
        this.email = this.app.user.email;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.sub = this.route.parent.params.subscribe(params => {
            this.id = +params['id?'];
            this.updateUser()
        })
    }

    updateUser() {
        let closure = (res => {
            this.user = res;
            this.userService.getCurrentTrainingBundles(this.user.id).subscribe( res => {
                console.log(res);
                    this.user.currentTrainingBundles = res["_embedded"].personalTrainingBundles;
            }, err => this._error())
        });

        if (this.id) {
            this.userService.findById(this.id).subscribe(closure, this._error());
        }
        else {
            this.userService.findByEmail(this.email).subscribe( closure, this._error());
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

    goTo(id) {
        this.router.navigate(["session", id])
    }

}