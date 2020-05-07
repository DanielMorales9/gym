import {Component, OnInit} from '@angular/core';
import {User} from '../model';
import {AuthService, UserService} from '../../core/controllers';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from './user-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {UserHelperService} from '../../core/helpers';
import {PolicyService} from '../../core/policy';
import {ImageModalComponent} from '../profile/image-modal.component';
import {catchError, filter, first, map, switchMap} from 'rxjs/operators';
import {throwError} from 'rxjs';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css', '../../styles/details.css'],
})
export class UserDetailsComponent implements OnInit {

    user: User;

    canDelete: boolean;
    canEdit: boolean;
    canSendToken: boolean;
    image_src: any;
    image_name: 'Immagine Profilo';

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
        this.route.params.pipe(
            first(),
            switchMap(params => this.service.findById(params['id']))
        ).subscribe(value => {
                this.user = value;
                this.getAvatar();
                this.getPolicies();
        });
    }

    private getPolicies() {
        const entity = this.USER_TYPE[this.user.type];
        this.canEdit = this.policy.get(entity, 'canEdit');
        this.canDelete = this.policy.get(entity, 'canDelete');
        this.canSendToken = this.policy.get(entity, 'canSendToken') && !this.user.verified;

    }

    openEditDialog(): void {
        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica Utente',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed().pipe(
            filter( r => !!r),
            switchMap(u => this.service.patchUser(u)),
            ).subscribe(
                (u: User) => this.snackbar.open(`L'utente ${u.lastName} è stato modificato`),
                error => this.snackbar.open(error.error.message)
        );
    }

    async deleteUser() {
        const confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            const [data, err] = await this.service.delete(this.user.id);
            if (err) {
                this.snackbar.open(err.error.message);
            }
            else {
                await this.router.navigate([this.root, 'users'], {replaceUrl: true});
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

    getAvatar() {
        this.service.retrieveImage(this.user.id).subscribe((res: any) => {
            this.image_src = `data:${res.type};base64,${res.picByte}`;
        }, err => {
            const gender = this.user.gender ? 'woman' : 'man';
            this.image_src = `https://cdn0.iconfinder.com/data/icons/people-and-lifestyle-2/64/fitness-${gender}-lifestyle-avatar-512.png`;
        });
    }

    openImageDialog() {
        const dialogRef = this.dialog.open(ImageModalComponent, {
            data: this.image_src
        });
    }
}
