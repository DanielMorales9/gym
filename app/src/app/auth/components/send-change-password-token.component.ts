import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, SnackBarService} from '../../services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './send-change-password-token.component.html',
    styleUrls: ['../../styles/root.css', './auth.css']
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

    changePassword() {
        this.authService.findByEmail(this.email.value).subscribe(_ => {
            this.buildForm();
            let message = "Ti abbiamo inviato un link per modificare la tua password.";
            this.snackbar.open(message);
            return this.router.navigateByUrl("/home")
        }, err => {
            this.errorMessage = err.message;
        })
    }

    get email() {
        return this.form.get("email");
    }

    private buildForm() {
        this.form = this.builder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

}
