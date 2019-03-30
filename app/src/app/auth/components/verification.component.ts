import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {User} from "../../shared/model";
import {AppService, AuthService, NotificationService} from "../../services";
import {UserHelperService} from "../../shared/services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/directives";


@Component({
    templateUrl: './verification.component.html',
    styleUrls: ['../../root.css']
})
export class VerificationComponent implements OnInit {

    user: User;
    form : FormGroup;

    token = '';
    toResendToken = false;

    constructor(private authService: AuthService,
                private appService: AppService,
                private userHelperService: UserHelperService,
                private builder: FormBuilder,
                private notificationService: NotificationService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.buildForm();

        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.authService.getUserFromVerificationToken(this.token).subscribe( (res) => {
            let user = res as User;
            if (user.verified) return this.router.navigateByUrl('/');
            else {
                this.user = user;
                this.userHelperService.getRoles(this.user);
            }
        },(err) => {
            if (err.status == 510) {
                this.toResendToken = true;
                this.user = err.error;
            }
            else if (err.status == 500) {
                this.toResendToken = true;
                this.router.navigate(['/error'], {
                    queryParams: { "message": err.message }
                })
            }
        });
    }

    get password() {
        return this.form.get("password")
    }

    get confirmPassword() {
        return this.form.get("confirmPassword")
    }


    private buildForm() {
        this.form = this.builder.group({
                password: ['', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30)
                ]],
                confirmPassword: ['', Validators.required]},
            {
                validator: passwordMatchValidator.bind(this)
            })
    }

    // TODO invalid token redirects somewhere

    verifyPassword() {

        this.user.password = this.password.value;
        this.user.confirmPassword = this.confirmPassword.value;
        this.authService.verifyPassword({email: this.user.email, password: this.user.password})
            .subscribe( (response: User) => {
                this.appService.authenticate({username: response.email, password: this.user.password},
                    (isAuthenticated) => {
                        if (!isAuthenticated) return this.router.navigate(['/error'],
                            {queryParams: { message: "Errore di Autenticazione" +
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