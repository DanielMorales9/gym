import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, Credentials} from '../../core/authentication';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['../../styles/root.css', './auth.css']
})
export class LoginComponent implements OnInit {

    error = false;
    form: FormGroup;

    credentials: Credentials = {username: '', password: '', remember: false};

    constructor(private auth: AuthenticationService,
                private builder: FormBuilder,
                private router: Router) {
    }

    ngOnInit(): void {
        this.buildForm();
    }

    async login() {
        this.credentials = {
            username: this.email.value,
            password: this.password.value,
            remember: false
        };
        const [data, error] = await this.auth.login(this.credentials);
        if (data) {
            this.error = false;
            await this.router.navigateByUrl('/home');
        }
        else {
            this.error = true;
        }
        console.log(this.error);
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
