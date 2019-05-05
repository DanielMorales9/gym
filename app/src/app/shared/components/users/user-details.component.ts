import {Component, OnInit} from '@angular/core';
import {User} from '../../model';
import {UserHelperService, UserService} from '../../services';
import {AppService, AuthService, SnackBarService} from '../../../services';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from './user-modal.component';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css'],
})
export class UserDetailsComponent implements OnInit {

    user: User;

    canDelete: boolean;
    canSell: boolean;
    canEdit: boolean;
    canSendToken: boolean;
    private me: User;
    private root: string;

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
        this.me = this.appService.user;
        this.root = this.route.parent.parent.snapshot.routeConfig.path;
        this.route.params.subscribe(params => {
            const id = params['id'];
            this.service.findById(id).subscribe((user: User) => {
                this.user = user;
                this.canDelete = this.user.id !== this.appService.user.id && this.me.type === 'A';
                this.canSell = this.user.type !== 'A' && this.me.type === 'A';
                this.canSendToken = this.me.type === 'A';
                this.canEdit = this.me.type === 'A';
            });
        });
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
            if (user) { this.patchUser(user); }
        });
    }

    private patchUser(user: User) {
        this.service.patch(user).subscribe((u: User) => this.user = u);
    }

    deleteUser() {
        const confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            this.service.delete(this.user.id)
                .subscribe(_ => this.router.navigate([this.root, 'users']));
        }
    }

    resendToken() {
        this.authService.resendTokenAnonymous(this.user.id)
            .subscribe(
                _ => {
                    this.snackbar.open('Controlla la mail per verificare il tuo account');
                },
                error => {
                    this.snackbar.open(error.error.message);
                });
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user);
    }

    buy() {
        return this.router.navigate([this.root, 'sales', 'buy', this.user.id]);
    }

}
