import {AppService} from "./services/app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import { User } from './users/user.class';


@Component({
    templateUrl: './verify.component.html',
    styleUrls: ['./app.component.css']
})
export class VerificationComponent implements OnInit {

    user: User;
    defaultRoles: any[];

    token = '';
    resent = false;
    toResendToken = false;

    constructor(private app: AppService, private activatedRoute: ActivatedRoute, private router: Router) {
    }

    private static defaultErrorCallback(err) {
        console.error(err);
    };

    verifyPassword() {
        var roleId = this.defaultRoles.reduce((a, b) => {
            return ( a < b)? a : b;
        });

        var role = this.app.INDEX2ROLE[roleId];
        var user = {email: this.user.email, password: this.user.password};
        // TODO add eventually server side password validation error handler
        this.app.changePassword(user, role.toLowerCase(), (response) => {
            var cred = {username: response.email, password: this.user.password};
            this.app.authenticate(cred, (isAuthenticated) => {
                if (!isAuthenticated) {
                    this.router.navigate(['/error'],
                        {queryParams:
                                { "message": "Errore di Autenticazione" +
                                        "<br>Rivolgiti all'amministratore per risolvere il problema"}})
                }
                else {
                    this.router.navigateByUrl('/');
                }
            }, VerificationComponent.defaultErrorCallback)
        }, VerificationComponent.defaultErrorCallback);
    }

    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

        this.app.getUserFromVerificationToken(this.token, (res) => {
            console.info(res);
            if (res.verified) {
                this.router.navigateByUrl('/');
            }
            else {
                this.user = {
                    height: NaN,
                    weight: NaN,
                    id: NaN,
                    createdAt: '',
                    defaultRoles: [],
                    verified: false,
                    email: res.email,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    type: '',
                    password: '',
                    confirmPassword: '',
                };
                this.defaultRoles = res.defaultRoles;
            }
        }, (err) => {
            console.info(err);
            if (err.status == 510) {
                this.toResendToken = true;
                this.user = err.error;
            }
            else if (err.status == 500) {
                this.toResendToken = true;
                this.router.navigate(['/error'], {queryParams: { "message": err.error.message }})
            }
        });
        console.info(this.token)
    }

    resendToken() {
        console.info(this.token);
        this.app.resendToken(this.token,(response) => {
            this.resent = true;
        }, (err) => {
            console.error(err);
            this.router.navigateByUrl('/error')
        })
    }

}