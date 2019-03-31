import {AuthService, NotificationService} from "../services";
import {User} from "../shared/model";
import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../shared/directives";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: 'change-password-modal.component.html',
    styleUrls: ['../root.css']
})
export class ChangePasswordModalComponent implements OnInit {

    user : User;
    form: FormGroup;

    constructor(private authService: AuthService,
                private messageService: NotificationService,
                public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
                private builder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.user = this.data.user;
    }

    ngOnInit(): void {

        this.form = this.builder.group({
                oldPassword: ['', [Validators.required]],
                password: ['', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30)
                    // Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^!"#$%&'()*+,-./:;<=>?$@$\[\]^_`{|}~]*[!"#$%&'()*+,-./:;<=>?$@$\[\]^_`{|}~])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$/)
                ]],
                confirmPassword: ['', Validators.required]},
            {
                validator: passwordMatchValidator.bind(this)
            })
    }

    onNoClick(): void {
        this.dialogRef.close();
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

    submit() {
        let model = {
            oldPassword: this.oldPassword.value,
            password: this.password.value,
            confirmPassword: this.confirmPassword.value
        };
        this.authService.changeNewPassword(this.user.id, model)
            .subscribe(_ => {
                this.messageService.sendMessage({
                    text: `${this.user.firstName}, la tua password è stata cambiata con successo!`,
                    class: "alert-success"
                });
                this.onNoClick();
            }, err => {
                this.messageService.sendMessage({text: err.error.message, class: "alert-danger"});
                this.onNoClick();
            })
    }
}
