import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {User} from '../../shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from '../../core/functions';
import {AuthenticationService} from '../../core/authentication';
import {AuthService} from '../../core/controllers';
import {SnackBarService} from '../../core/utilities';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/base-component';


@Component({
    templateUrl: './verification.component.html',
    styleUrls: ['../../styles/root.css', './auth.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationComponent extends BaseComponent implements OnInit {

    user: User;
    form: FormGroup;

    token = '';
    toResendToken = false;
    resendTokenMessage = '';
    QUERY_PARAMS = { message: 'Errore di Autenticazione<br>Rivolgiti all\'amministratore per risolvere il problema.'};

    constructor(private authService: AuthService,
                private auth: AuthenticationService,
                private builder: FormBuilder,
                private snackbar: SnackBarService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.user = new User();
        this.buildForm();
        const tokenSub = this.activatedRoute.queryParamMap.pipe(takeUntil(this.unsubscribe$));
        this.userFromToken(tokenSub);
    }

    private userFromToken(tokenSub) {
        tokenSub.pipe(map((params: ParamMap) => {
            this.token = params.get('token');
            return this.token;
            }),
            switchMap(r => this.authService.getUserFromVerificationToken(r)))
            .subscribe(res => {
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
        const credentials = {email: this.user.email, password: this.user.password};
        this.authService.confirmRegistration(credentials)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(d => this.router.navigateByUrl('/auth/login', {replaceUrl: true}),
            d => this.router.navigate(['/error'], {replaceUrl: true, queryParams: this.QUERY_PARAMS}));
    }


    resendToken() {
        this.authService.resendToken(this.token)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
                const message = `${this.user.firstName}, il tuo token è stato re-inviato, <br>Controlla la posta elettronica!`;
                this.snackbar.open(message);
                return this.router.navigateByUrl('/', {replaceUrl: true});
            });
    }
}
