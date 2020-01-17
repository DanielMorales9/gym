import {Component, OnInit} from '@angular/core';
import {User} from '../../model';
import {AuthService, UserService} from '../../../core/controllers';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from './user-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../../core/utilities';
import {UserHelperService} from '../../../core/helpers';
import {PolicyService} from '../../../core/policy';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/card.css', '../../../styles/details.css'],
})
export class UserDetailsComponent implements OnInit {

    user: User;

    canDelete: boolean;
    canSell: boolean;
    canEdit: boolean;
    canSendToken: boolean;
    canMakeAppointments: boolean;
    canShowSales: boolean;
    canShowBundles: boolean;

    USER_TYPE = {A: 'admin', T: 'trainer', C: 'customer'};
    private root: string;

    constructor(private service: UserService,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private policy: PolicyService,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.root = this.route.parent.parent.snapshot.routeConfig.path;

        this.route.params.subscribe(async params => {
            const id = params['id'];
            const [data, error] = await this.service.findById(id);
            if (error) {
                throw error;
            }
            else {
                this.user = data;
                this.getPolicies();
            }
        });
    }

    private getPolicies() {
        const entity = this.USER_TYPE[this.user.type];
        this.canEdit = this.policy.get(entity, 'canEdit');
        this.canDelete = this.policy.get(entity, 'canDelete');
        this.canSell = this.policy.get(entity, 'canSell');
        this.canSendToken = this.policy.get(entity, 'canSendToken') && !this.user.verified;
        this.canMakeAppointments = this.policy.get(entity, 'canMakeAppointments');
        this.canShowBundles = this.policy.get(entity, 'canShow', 'bundles');
        this.canShowSales = this.policy.get(entity, 'canShow', 'sales');
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

    private async patchUser(user: User) {
        const [data, error] = await this.service.patch(user);
        if (error) {
            this.snackbar.open(error.error.message);
        } else {
            this.snackbar.open(`L'utente ${user.lastName} è stato modificato`);
        }
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

    sell() {
        return this.router.navigate([this.root, 'sales', 'buy', this.user.id]);
    }

    makeAppointments() {
        return this.router.navigate([this.root, 'calendar', this.user.id]);
    }

    getRoleName() {
        let name;
        if (!this.user) { return name; }
        switch (this.user.type) {
            case 'A':
                name = 'Amministratore';
                break;
            case 'C':
                name = 'Cliente';
                break;
            case 'T':
                name = 'Allenatore';
                break;
            default:
                name = 'Cliente';
                break;
        }
        return name;
    }

    showBundles() {
        return this.router.navigate([this.root, 'customer', 'bundles'], {queryParams: {
            id: this.user.id
            }});
    }

    showSales() {
        return this.router.navigate([this.root, 'sales'], {queryParams: {
                id: this.user.id
            }});
    }
}
