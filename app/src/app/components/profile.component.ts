import {Component, OnInit} from '@angular/core';
import {User} from '../shared/model';
import {AppService, AuthService, SnackBarService} from '../services';
import {UserHelperService, UserService} from '../shared/services';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from '../shared/components/users';
import {ChangePasswordModalComponent} from './change-password-modal.component';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../styles/root.css', '../styles/card.css'],
})
export class ProfileComponent implements OnInit {

    user: User;

    constructor(private appService: AppService,
                private userService: UserService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.user = this.appService.user;
    }

    openDialog(): void {

        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica i tuoi Dati',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed().subscribe((user: User) => {
            if (user) { this.userService.patch(user).subscribe((u: User) => this.user = u); }
        });
    }


    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user);
    }

    openPasswordDialog() {
        const dialogRef = this.dialog.open(ChangePasswordModalComponent);

        dialogRef.afterClosed().subscribe(passwordForm => {
            if (passwordForm) {
                this.authService.changeNewPassword(this.user.id, passwordForm)
                    .subscribe(_ => {
                        const message = `${this.user.firstName}, la tua password è stata cambiata con successo!`;
                        this.snackbar.open(message);
                    }, err => {
                        this.snackbar.open(err.error.message);
                    });
            }
        });
    }
}
