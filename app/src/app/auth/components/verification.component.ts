import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {User} from "../../shared/model";
import {AppService} from "../../app.service";
import {UserHelperService} from "../../shared/services";
import {NotificationService} from "../../services";


@Component({
    templateUrl: './verification.component.html',
    styleUrls: ['../../app.component.css']
})
export class VerificationComponent implements OnInit {

    user: User;

    token = '';
    toResendToken = false;

    constructor(private app: AppService,
                private userHelperService: UserHelperService,
                private notificationService: NotificationService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.app.getUserFromVerificationToken(this.token).subscribe( (res) => {
            let user = res as User;
            if (user.verified) this.router.navigateByUrl('/');
            else {
                this.user = user;
                this.userHelperService.getRoles(this.user)
            }
        },(err) => {
            if (err.status == 510) {
                this.toResendToken = true;
                this.user = err.error;
            }
            else if (err.status == 500) {
                this.toResendToken = true;
                this.router.navigate(['/error'], {
                    queryParams: { "message": err.error.message }
                })
            }
        });
    }

    verifyPassword() {
        let roleName = this.user.roles.reduce((a, b) => {return ( a.id < b.id) ? a : b;}).name.toLowerCase();

        this.app.verifyPassword({email: this.user.email, password: this.user.password}, roleName)
            .subscribe( (response: User) => {
                this.app.authenticate({username: response.email, password: this.user.password},
                    (isAuthenticated) => {
                        if (!isAuthenticated) return this.router.navigate(['/error'],
                            {queryParams: { "message": "Errore di Autenticazione" +
                                        "<br>Rivolgiti all'amministratore per risolvere il problema"}});
                        else return this.router.navigateByUrl('/');
                    })
            });
    }


    resendToken() {
        this.app.resendToken(this.token).subscribe((response) => {
            this.notificationService.sendMessage({
                text: `${this.user.firstName}, il tuo token è stato re-inviato, <br>Controlla la posta elettronica!`,
                class: "alert-success"
            });
            return this.router.navigateByUrl("/")
        })
    }

}