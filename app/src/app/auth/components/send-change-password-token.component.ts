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
            if (err.status == 502) {
                this.router.navigate(['/error'],
                    {queryParams: {
                            "title": "Verifica prima il tuo account",
                            "message":
                                "Controlla che nella tua posta elettronica ci sia un email di verifica."+
                                "<br>In caso non dovessi trovare la mail, rivolgiti in segreteria."
                        }});
            }
            else this.notificationService.sendMessage({
                text: "Qualcosa è andato storto!",
                class: "alert-danger"
            });
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