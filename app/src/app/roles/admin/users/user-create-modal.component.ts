import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {User} from '../../../shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, SnackBarService} from '../../../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'user-create-modal',
    templateUrl: './user-create-modal.component.html',
    styleUrls: ['../../../root.css']
})
export class UserCreateModalComponent implements OnInit {

    @Output() public event = new EventEmitter();
    form: FormGroup;

    constructor(private builder: FormBuilder,
                private authService: AuthService,
                private snackbar: SnackBarService,
                public dialogRef: MatDialogRef<UserCreateModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    // TODO add spinner on modal

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm() {
        let user = new User();

        this.form = this.builder.group({
            email: [user.email, [Validators.required, Validators.email]],
            firstName: [user.firstName, [Validators.required]],
            lastName: [user.lastName, [Validators.required]],
            type: [user.type, [Validators.required]]
        });
    }

    get email() {
        return this.form.get("email")
    }

    get firstName() {
        return this.form.get("firstName")
    }

    get lastName() {
        return this.form.get("lastName")
    }

    get type() {
        return this.form.get("type")
    }

    _success() {
        return _ => {
            let message = `L'utente ${this.lastName.value} è stato creato`;
            this.snackbar.open(message);
            this.onNoClick();
        }
    }

    _error() {
        return err => {
            if (err.status == 500) {
                this.snackbar.open(err.error.message, );
                this.onNoClick();
            }
            else throw err;
        }
    }

    createUser() {
        let user = new User();
        user.firstName = this.firstName.value;
        user.lastName = this.lastName.value;
        user.email = this.email.value;
        user.type = this.type.value;
        this.authService.registration(user).subscribe(
            this._success(),
            this._error(),
            () => {
                this.onNoClick();
            });
    }

}
