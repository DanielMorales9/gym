import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/controllers';
import {SnackBarService} from '../../core';

@Component({
    templateUrl: './send-change-password-token.component.html',
    styleUrls: ['../../styles/root.css', './auth.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendChangePasswordTokenComponent implements OnInit {

    form: FormGroup;
    errorMessage: string;

    constructor(private authService: AuthService,
                private builder: FormBuilder,
                private snackbar: SnackBarService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.buildForm();
    }

    forgotPassword() {
        this.authService.forgotPassword(this.email.value).pipe().subscribe(res => {
            this.buildForm();
            const message = 'Ti abbiamo inviato un link per modificare la tua password.';
            this.snackbar.open(message);
            this.router.navigateByUrl('/auth', {replaceUrl: true});
        }, err => this.errorMessage = err.error.message);
    }

    get email() {
        return this.form.get('email');
    }

    private buildForm() {
        this.form = this.builder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

}
