import {AuthService, NotificationService} from "../../services";
import {User} from "../../shared/model";
import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/directives";

@Component({
    selector: 'change-password-modal',
    templateUrl: 'change-password-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

    @Input() public user : User;

    loading: boolean;
    form: FormGroup;

    constructor(private authService: AuthService,
                private messageService: NotificationService,
                private builder: FormBuilder) {
        this.loading = false;
    }

    ngOnInit(): void {

        this.form = this.builder.group({
                oldPassword: ['', [Validators.required]],
                password: ['', [
                    Validators.required,
                    Validators.minLength(8)
                    // Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^!"#$%&'()*+,-./:;<=>?$@$\[\]^_`{|}~]*[!"#$%&'()*+,-./:;<=>?$@$\[\]^_`{|}~])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$/)
                ]],
                confirmPassword: ['', Validators.required]},
            {
                validator: passwordMatchValidator.bind(this)
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
            }, _ => {
                this.loading = false;
                document.getElementById("changePasswordModal").click();
                let message ={
                    text: "Qualcosa è andato storto",
                    class: "alert-danger"
                };
                this.messageService.sendMessage(message);
            })
    }
}