import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/model';
import {UserHelperService, UserService} from '../../../shared/services';
import {AppService, AuthService} from '../../../services';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserPatchModalComponent} from '../../../shared/components/users';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../../root.css', '../../../card.css'],
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
                private snackBar: MatSnackBar) {
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

        const dialogRef = this.dialog.open(UserPatchModalComponent, {
            data: {
                user: this.user
            }
        });

        // dialogRef.afterClosed().subscribe(_ => {
        //     console.log('closed')
        // });
    }

    deleteUser() {
        let confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            this.service.delete(this.user.id)
                .subscribe(_ => this.router.navigateByUrl('/admins/users'))
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    resendToken() {
        this.authService.resendTokenAnonymous(this.user.id)
            .subscribe(
                _ => {
                    this.openSnackBar('Controlla la mail per verificare il tuo account', 'Chiudi')
                },
                error => {
                    this.openSnackBar(error.error.message, 'Chiudi')
                })
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user)
    }

    buy() {
        return this.router.navigate(['admin', 'buy', this.user.id])
    }
}
