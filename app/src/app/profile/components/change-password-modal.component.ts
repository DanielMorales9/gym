import {AuthService, NotificationService} from "../../services";
import {User} from "../../shared/model";
import {Component, Input, OnInit} from "@angular/core";
import {AbstractControl, Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EqualValidator} from "../../shared/directives";

@Component({
    selector: 'change-password-modal',
    templateUrl: 'change-password-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

    @Input() public user : User;

    loading: boolean;
    form: FormGroup;
    error: boolean;

    constructor(private authService: AuthService,
                private messageService: NotificationService,
                private builder: FormBuilder) {
        this.loading = false;
        this.error = false;
    }



    ngOnInit(): void {

        this.form = this.builder.group({
                oldPassword: ['', [Validators.required]],
                password: ['', [
                    Validators.required,
                    Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^$@$!%*#?&]*[$@$!%*#?&])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$/)
                ]
                ],
                confirmPassword: ['', Validators.required]},
            {
                validator: this.passwordMatchValidator.bind(this)
            })
    }

    get oldPassword() {
        return this.form.get("oldPassword")
    }

    get password() {
        return this.form.get("password")
    }

    get confirmPassword() {
        return this.form.get("confirmPassword")
    }

    changePassword() {
        let model = {
            oldPassword: this.oldPassword.value,
            password: this.password.value,
            confirmPassword: this.confirmPassword.value
        };
        this.authService.changeNewPassword(this.user.id, model)
            .subscribe(value => {
                document.getElementById("changePasswordModal").click();
                let message = {
                    text: `${this.user.firstName}, la tua password è stata cambiata con successo!`,
                    class: "alert-success"
                };
                this.messageService.sendMessage(message);
            }, error1 => {
                this.error = true
            })
    }

    passwordMatchValidator(control: AbstractControl) {
        const password: string = control.get('password').value; // get password from our password form control
        const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
        // compare is the password math
        if (password !== confirmPassword) {
            // if they don't match, set an error in our confirmPassword form control
            control.get('confirmPassword').setErrors({ noPasswordMatch: true });
        }
    }
}