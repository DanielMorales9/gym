import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/model';
import {AppService, AuthService, SnackBarService} from '../../services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from '../../shared/directives';


@Component({
    templateUrl: './verification.component.html',
    styleUrls: ['../../styles/root.css', './auth.css']
})
export class VerificationComponent implements OnInit {

    user: User;
    form: FormGroup;

    token = '';
    toResendToken = false;
    resendTokenMessage = '';

    constructor(private authService: AuthService,
                private appService: AppService,
                private builder: FormBuilder,
                private snackbar: SnackBarService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.buildForm();

        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.authService.getUserFromVerificationToken(this.token).subscribe( (res: User) => {
            this.user = res;
            if (this.user.verified) { return this.router.navigateByUrl('/'); }
        }, (err) => {
            if (err.status === 404) {
                this.snackbar.open(err.error.message);
                return this.router.navigateByUrl('/auth/login');
            } else if (err.status < 500) {
                this.resendTokenMessage = err.error.message;
                this.toResendToken = true;
            } else { throw err; }
        });
    }

    get password() {
        return this.form.get('password');
    }

    get confirmPassword() {
        return this.form.get('confirmPassword');
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
            });
    }

    confirmRegistration() {
        this.user.password = this.password.value;
        this.user.confirmPassword = this.confirmPassword.value;
        this.authService.confirmRegistration({email: this.user.email, password: this.user.password})
            .subscribe( (response: User) => {
                this.appService.authenticate({username: response.email, password: this.user.password},
                    (isAuthenticated) => {
                        if (!isAuthenticated) { return this.router.navigate(['/error'],
                            {queryParams: { message: 'Errore di Autenticazione' +
                                        '<br>Rivolgiti all\'amministratore per risolvere il problema.'}});
                        } else { return this.router.navigateByUrl('/'); }
                    });
            });
    }


    resendToken() {
        this.authService.resendToken(this.token).subscribe((_) => {
            const message = `${this.user.firstName}, il tuo token è stato re-inviato, <br>Controlla la posta elettronica!`;
            this.snackbar.open(message);
            return this.router.navigateByUrl('/');
        });
    }
}
