import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../shared/model';
import {UserHelperService} from '../../shared/services';
import {AppService, AuthService, SnackBarService} from '../../services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from '../../shared/directives';

@Component({
    templateUrl: './modify-password.component.html',
    styleUrls: ['../../styles/root.css', './auth.css']
})
export class ModifyPasswordComponent implements OnInit {

    form: FormGroup;

    token: string;
    user = new User();
    toResendToken: boolean;
    resendTokenMessage = '';

    constructor(private activatedRoute: ActivatedRoute,
                private userHelperService: UserHelperService,
                private appService: AppService,
                private snackbar: SnackBarService,
                private authService: AuthService,
                private builder: FormBuilder,
                private router: Router) {
    }


    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.buildForm();
        this.authService.getUserFromVerificationToken(this.token).subscribe( (res: User) => {
            this.user = res;
            this.buildForm();
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

    modifyPassword() {
        const form = {password: this.password.value, oldPassword: '', confirmPassword: this.confirmPassword.value};

        this.authService.changePassword(this.user.id, form).subscribe(_ => {
            const message = `${this.user.firstName} la tua password è stata modificata con successo!`;
            this.snackbar.open(message);
            return this.router.navigateByUrl('/');
        });
    }

    resendToken() {
        this.authService.resendToken(this.token).subscribe((_) => {
            const message = 'Il tuo token è stato re-inviato';
            this.snackbar.open(message);
            return this.router.navigateByUrl('/auth/login');
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
}
