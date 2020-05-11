import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../shared/model';
import {UserHelperService} from '../../core/helpers';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from '../../core/functions';
import {AuthService} from '../../core/controllers';
import {SnackBarService} from '../../core/utilities';
import {BaseComponent} from '../../shared/base-component';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './modify-password.component.html',
    styleUrls: ['../../styles/root.css', './auth.css']
})
export class ModifyPasswordComponent extends BaseComponent implements OnInit {

    form: FormGroup;

    token: string;
    user = new User();
    toResendToken: boolean;
    resendTokenMessage = '';

    constructor(private activatedRoute: ActivatedRoute,
                private userHelperService: UserHelperService,
                private snackbar: SnackBarService,
                private authService: AuthService,
                private builder: FormBuilder,
                private router: Router) {
        super();
    }


    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.buildForm();
        this.userFromToken();

    }

    private userFromToken() {
        this.authService.getUserFromVerificationToken(this.token)
            .pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
            this.user = res;
            this.buildForm();
        }, err => {
            if (err.status === 404) {
                this.snackbar.open(err.error.message);
                this.router.navigateByUrl('/auth/login', {replaceUrl: true});
            } else if (err.status < 500) {
                this.resendTokenMessage = err.error.message;
                this.toResendToken = true;
            }
        });
    }

    modifyPassword() {
        const form = {password: this.password.value, oldPassword: '', confirmPassword: this.confirmPassword.value};

        this.authService.changePasswordAnonymous(this.user.id, form)
            .pipe(takeUntil(this.unsubscribe$)).subscribe(res =>     {
                const message = `${this.user.firstName} la tua password è stata modificata con successo!`;
            this.snackbar.open(message);
            return this.router.navigateByUrl('/', {replaceUrl: true});
        });
    }

    resendToken() {
        this.authService.resendToken(this.token)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
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
