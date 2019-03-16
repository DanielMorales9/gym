import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../shared/model";
import {UserHelperService} from "../../shared/services";
import {AppService, AuthService, NotificationService} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/directives";

@Component({
    templateUrl: './modify-password.component.html',
    styleUrls: ['../../root.css']
})
export class ModifyPasswordComponent implements OnInit {

    form: FormGroup;

    token: string;
    user = new User();
    toResendToken: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private userHelperService: UserHelperService,
                private appService: AppService,
                private notificationService: NotificationService,
                private authService: AuthService,
                private builder: FormBuilder,
                private router: Router) {
    }


    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.buildForm();
        this.authService.getUserFromVerificationToken(this.token).subscribe( (res: User) => {
            this.user = res;
            this.userHelperService.getRoles(this.user);
            this.buildForm();
        }, (err) => {
            this.toResendToken = true;
            return this.router.navigate(['/error'], {
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
        this.user.password = this.password.value;
        this.user.confirmPassword = this.confirmPassword.value;

        this.authService.changePassword(this.user, userType).subscribe(res => {
            this.notificationService.sendMessage({
                text: `${this.user.firstName} la tua password è stata modificata con successo!<br>Ora puoi accedere alla tua area Personale.`,
                class: "alert-success",
            });
            let user: any = res;
            this.appService.authenticate({username: user.email, password: this.user.password},(isAuthenticated) => {
                    if (!isAuthenticated)
                        return this.router.navigate(['/error'], { queryParams: {
                                message: "Errore di Autenticazione <br>" +
                                    "Rivolgiti all'amministratore per risolvere il problema."
                            }});
                    else return this.router.navigateByUrl('/');
                });
        }, err => {
            console.log(err);
            return this.router.navigate(['/error'],
                {queryParams: {
                        title: err.error.message,
                        message:  "Rivolgiti all'amministratore per risolvere il problema"
                }});
        })
    }

    resendToken() {
        this.authService.resendChangePasswordToken(this.token).subscribe((_) => {
            this.notificationService.sendMessage({
                text: `${this.user.firstName}, il tuo token è stato re-inviato, <br>Controlla la posta elettronica!`,
                class: "alert-success"
            });
            return this.router.navigateByUrl("/auth/login")
        });
    }

    get password() {
        return this.form.get("password");
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
}