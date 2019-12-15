import {Component, OnInit} from '@angular/core';
import {User} from '../../model';
import {UserHelperService, UserService} from '../../services';
import {AuthService, SnackBarService} from '../../../services';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from './user-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../core/authentication';


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
                private auth: AuthenticationService,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.me = this.auth.getUser();
        this.root = this.route.parent.parent.snapshot.routeConfig.path;

        this.route.params.subscribe(async params => {
            const id = params['id'];
            const [data, error] = await this.service.findById(id);
            if (error) {
                throw error;
            }
            else {
                this.user = data;
                this.canDelete = this.user.id !== this.me.id && this.me.type === 'A';
                this.canSell = this.user.type === 'C' && this.me.type === 'A';
                this.canSendToken = this.me.type === 'A' && !this.user.verified;
                this.canEdit = this.me.type === 'A';
            }
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

    async deleteUser() {
        const confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            const [data, err] = await this.service.delete(this.user.id);
            if (err) {
                this.snackbar.open(err.error.message);
            }
            else {
                await this.router.navigate([this.root, 'users']);
            }
        }
    }


    async resendToken() {
        const [data, error] = await this.authService.resendTokenAnonymous(this.user.id);
        if (error) {
            this.snackbar.open(error.error.message);
        } else {
            this.snackbar.open('Controlla la mail per verificare il tuo account');
        }
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user);
    }

    buy() {
        return this.router.navigate([this.root, 'sales', 'buy', this.user.id]);
    }

}
