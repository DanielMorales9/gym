import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passwordMatchValidator} from '../../core/functions';
import {MatDialogRef} from '@angular/material';

@Component({
    templateUrl: 'change-password-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class ChangePasswordModalComponent implements OnInit {

    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
                private builder: FormBuilder) {
    }

    ngOnInit(): void {

        this.form = this.builder.group({
                oldPassword: ['', [Validators.required]],
                password: ['', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30)
                    // tslint:disable-next-line:max-line-length
                    // Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^!"#$%&'()*+,-./:;<=>?$@$\[\]^_`{|}~]*[!"#$%&'()*+,-./:;<=>?$@$\[\]^_`{|}~])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$/)
                ]],
                confirmPassword: ['', Validators.required]},
            {
                validator: passwordMatchValidator.bind(this)
            });
    }

    get oldPassword() {
        return this.form.get('oldPassword');
    }

    get password() {
        return this.form.get('password');
    }

    get confirmPassword() {
        return this.form.get('confirmPassword');
    }

    submit() {
        const model = {
            oldPassword: this.oldPassword.value,
            password: this.password.value,
            confirmPassword: this.confirmPassword.value
        };
        this.dialogRef.close(model);
    }
}
