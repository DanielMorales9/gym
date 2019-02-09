import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService, NotificationService} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    templateUrl: './send-change-password-token.component.html',
    styleUrls: ['../../app.component.css']
})
export class SendChangePasswordTokenComponent implements OnInit {

    form: FormGroup;
    errorMessage: string;

    constructor(private authService: AuthService,
                private builder: FormBuilder,
                private notificationService: NotificationService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.buildForm();
    }

    changePassword() {
        this.authService.findByEmail(this.email.value).subscribe(_ => {
            this.buildForm();
            let message = "Controlla la tua casella postale,<br>" +
                "ti abbiamo inviato un link per modificare la tua password.";
            let className = "alert-success";
            this.notificationService.sendMessage({
                text: message,
                class: className
            });
            return this.router.navigateByUrl("/home")
        }, err => {
            this.errorMessage = err.error.message;
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