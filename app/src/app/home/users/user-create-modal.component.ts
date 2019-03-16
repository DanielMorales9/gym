import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {User} from "../../shared/model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserHelperService} from "../../shared/services";
import {AuthService, NotificationService} from "../../services";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: 'user-create-modal',
    templateUrl: './user-create-modal.component.html',
    styleUrls: ['../../root.css']
})
export class UserCreateModalComponent implements OnInit {

    @Output() public event = new EventEmitter();
    form: FormGroup;

    CONSTRAINT_VIOLATION_EXCEPTION = "ConstraintViolationException";

    constructor(private builder: FormBuilder,
                private authService: AuthService,
                private userHelperService: UserHelperService,
                private notificationService: NotificationService,
                public dialogRef: MatDialogRef<UserCreateModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

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
            let message = {
                text: `L'utente ${this.lastName.value} è stato creato`,
                class: "alert-success"
            };
            this.notificationService.sendMessage(message);
            this.onNoClick()
        }
    }

    _error() {
        return err => {
            let text = "Errore Interno al Sistema.";
            if (err.error) {
                if (err.error.message) {
                    if (err.error.message.indexOf(this.CONSTRAINT_VIOLATION_EXCEPTION) > -1)
                        text = "Esiste già un utente con questa email!";
                }
            }
            let message = {
                text: text,
                class: "alert-danger"
            };
            this.notificationService.sendMessage(message);
            this.onNoClick()
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
            this._error());
    }

}