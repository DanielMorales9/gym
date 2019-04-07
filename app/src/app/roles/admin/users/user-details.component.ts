import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/model';
import {UserHelperService, UserService} from '../../../shared/services';
import {AppService, AuthService, SnackBarService} from '../../../services';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from '../../../shared/components/users';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class UserDetailsComponent implements OnInit {

    user: User;

    canDelete: boolean = false;
    canSell: boolean = false;

    constructor(private service: UserService,
                private appService: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.route.params.subscribe(params => {
            const id = params['id'];
            this.service.findById(id).subscribe((user: User) => {
                this.user = user;
                this.canDelete = this.user.id !== this.appService.user.id;
                this.canSell = this.user.type == 'C';
            })
        })
    }

    openEditDialog(): void {

        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica Utente',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed().subscribe(user => {
            if (user) this.patchUser(user);
        });
    }

    private patchUser(user: User) {
        this.service.patch(user).subscribe((user: User) => this.user = user)
    }

    deleteUser() {
        let confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            this.service.delete(this.user.id)
                .subscribe(_ => this.router.navigateByUrl('/admins/users'))
        }
    }

    resendToken() {
        this.authService.resendTokenAnonymous(this.user.id)
            .subscribe(
                _ => {
                    this.snackbar.open('Controlla la mail per verificare il tuo account')
                },
                error => {
                    this.snackbar.open(error.error.message)
                })
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user)
    }

    buy() {
        return this.router.navigate(['admin', 'sales', 'buy', this.user.id])
    }

}
