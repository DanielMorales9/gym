import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './send-change-password-token.component.html',
    styleUrls: ['../../app.component.css']
})
export class SendChangePasswordTokenComponent {

    email: string;
    error: boolean = false;
    sent: boolean = false;

    constructor(private app: AppService,
                private router: Router) {
    }

    changePassword() {
        this.app.credentials = undefined;
        this.app.findByEmail(this.email).subscribe(res => {
            this.sent = true;
        }, err => {
            if (err.status == 502) {
                this.router.navigate(['/error'],
                    {queryParams: { "message": "Il tuo account non è stato ancora verificato." +
                                "<br>Controlla che nella tua posta elettronica ci sia un email di verifica."+
                                "<br>In caso non dovessi trovare la mail, rivolgiti in segreteria."
                    }});
            }
            else this.error = true;
        })
    }

    end() {
        this.router.navigateByUrl("/home")
    }

}