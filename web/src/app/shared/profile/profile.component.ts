import {Component, OnInit} from '@angular/core';
import {User} from '../model';
import {UserService} from '../../core/controllers';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from '../users';
import {ChangePasswordModalComponent} from './change-password-modal.component';
import {AuthenticationService} from '../../core/authentication';
import {AuthService} from '../../core/controllers';
import {SnackBarService} from '../../core/utilities';
import {UserHelperService} from '../../core/helpers';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
})
export class ProfileComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationService,
                private userService: UserService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.user = this.auth.getUser();
    }

    openDialog(): void {

        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica i tuoi Dati',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed().subscribe(async (user: User) => {
            if (user) {
                const [data, error] = await this.userService.patch(user);
                if (error) {
                    this.snackbar.open(error.error.message);
                } else {
                    this.snackbar.open(`L'utente ${user.lastName} è stato modificato`);
                }
            }
        });
    }


    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user);
    }

    async openPasswordDialog() {
        const dialogRef = this.dialog.open(ChangePasswordModalComponent);

        const passwordForm = await dialogRef.afterClosed().toPromise();

        if (passwordForm) {
            const [data, err] = await this.authService.changePassword(this.user.id, passwordForm);
            if (err) {
                this.snackbar.open(err.error.message);
            } else {
                const message = `${this.user.firstName}, la tua password è stata cambiata con successo!`;
                this.snackbar.open(message);
            }
        }
    }
}
