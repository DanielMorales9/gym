import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {User} from "../../shared/model";
import {AppService} from "../../services";
import {UserHelperService} from "../../shared/services";
import {AuthService, NotificationService} from "../../services";


@Component({
    templateUrl: './verification.component.html',
    styleUrls: ['../../app.component.css']
})
export class VerificationComponent implements OnInit {

    user: User;

    token = '';
    toResendToken = false;

    constructor(private authService: AuthService,
                private appService: AppService,
                private userHelperService: UserHelperService,
                private notificationService: NotificationService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.authService.getUserFromVerificationToken(this.token).subscribe( (res) => {
            let user = res as User;
            if (user.verified) return this.router.navigateByUrl('/');
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

        this.authService.verifyPassword({email: this.user.email, password: this.user.password}, roleName)
            .subscribe( (response: User) => {
                this.appService.authenticate({username: response.email, password: this.user.password},
                    (isAuthenticated) => {
                        if (!isAuthenticated) return this.router.navigate(['/error'],
                            {queryParams: { "message": "Errore di Autenticazione" +
                                        "<br>Rivolgiti all'amministratore per risolvere il problema."}});
                        else return this.router.navigateByUrl('/');
                    })
            });
    }


    resendToken() {
        this.authService.resendToken(this.token).subscribe((response) => {
            this.notificationService.sendMessage({
                text: `${this.user.firstName}, il tuo token è stato re-inviato, <br>Controlla la posta elettronica!`,
                class: "alert-success"
            });
            return this.router.navigateByUrl("/")
        })
    }

}