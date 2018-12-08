import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../../app.service";
import {User} from "../../shared/model";
import {UserHelperService} from "../../shared/services";
import {NotificationService} from "../../services";

@Component({
    templateUrl: './modify-password.component.html',
    styleUrls: ['../../app.component.css']
})
export class ModifyPasswordComponent {

    token: string;
    user = new User();
    toResendToken: boolean;
    error: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private userHelperService: UserHelperService,
                private notificationService: NotificationService,
                private app: AppService,
                private router: Router) {
    }


    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

        this.app.getUserFromVerificationToken(this.token).subscribe( (res: User) => {
            this.user = res;
            this.userHelperService.getRoles(this.user);
        }, (err) => {
            this.toResendToken = true;
            this.router.navigate(['/error'], {
                queryParams: { "message": err.error.message }
            })
        });
    }

    modifyPassword() {
        let userType = "";
        switch (Math.min(...this.user.roles.map(value => value.id))) {
            case 3:
                userType="customer";
                break;
            case 2:
                userType="trainer";
                break;
            case 1:
                userType="admin";
                break;
            default:
                break;
        }
        this.app.changePassword(this.user, userType).subscribe(res => {
            this.notificationService.sendMessage({
                text: `${this.user.firstName} la tua password è stata modificata, <br> Ora puoi accedere alla tua area Personale.`,
                class: "alert-success",
            });
            return this.router.navigateByUrl("/")
        }, err => {
            return this.router.navigate(['/error'],
                {queryParams: { "message": "Errore sconosciuto!" +
                            "<br>Rivolgiti all'amministratore per risolvere il problema"}});
        })
    }

    resendToken() {
        this.app.resendChangePasswordToken(this.token).subscribe((response) => {
            this.notificationService.sendMessage({
                text: `${this.user.firstName}, il tuo token è stato re-inviato, <br>Controlla la posta elettronica!`,
                class: "alert-success"
            });
            return this.router.navigateByUrl("/auth/login")
        })
    }
}