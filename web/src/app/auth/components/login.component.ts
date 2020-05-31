import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../core/authentication';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/base-component';
import {Credentials} from '../../shared/model';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['../../styles/root.css', './auth.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseComponent implements OnInit {

    error = false;
    form: FormGroup;

    credentials: Credentials = {username: '', password: '', remember: false};

    constructor(private auth: AuthenticationService,
                private builder: FormBuilder,
                private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.buildForm();
    }

    login() {
        this.credentials = {
            username: this.email.value,
            password: this.password.value,
            remember: false
        };
        this.auth.login(this.credentials)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                if (!!data) {
                    const roleId = this.auth.getPrincipalRole();
                    const roleName = data.roles.find(value => value.id === roleId).name.toLowerCase();
                    this.error = false;
                    this.router.navigateByUrl(roleName);
                }
                else {
                    this.error = true;
                }
            });
    }


    private buildForm() {
        this.form = this.builder.group({
            email: [this.credentials.username, [Validators.required]],
            password: [this.credentials.password, Validators.required],
        });
    }

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

}
