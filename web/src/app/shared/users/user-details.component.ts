import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TypeNames, User} from '../model';
import {AuthService, UserService} from '../../core/controllers';
import { MatDialog } from '@angular/material/dialog';
import {UserModalComponent} from './user-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {PolicyService} from '../../core/policy';
import {ImageModalComponent} from '../profile/image-modal.component';
import {filter, first, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base-component';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css', '../../styles/details.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent extends BaseComponent implements OnInit {

    user: User;

    canDelete: boolean;
    canEdit: boolean;
    canSendToken: boolean;
    image_src: any;
    image_name: 'Immagine Profilo';

    USER_TYPE = {A: 'admin', T: 'trainer', C: 'customer'};
    private root: string;
    mapNames = TypeNames;

    constructor(private service: UserService,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private policy: PolicyService,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private snackbar: SnackBarService) {
        super();
    }

    ngOnInit(): void {
        this.user = new User();
        this.root = this.route.parent.parent.snapshot.routeConfig.path;
        this.route.params.pipe(
            takeUntil(this.unsubscribe$),
            first(),
            switchMap(params => this.service.findUserById(params['id']))
        ).subscribe(value => {
            this.user = value;
            this.getAvatar();
            this.getPolicies();
            this.cdr.detectChanges();
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
            takeUntil(this.unsubscribe$),
            filter( r => !!r),
            switchMap(u => this.service.patchUser(u)),
        ).subscribe(
            (u: User) => this.snackbar.open(`L'utente ${u.lastName} è stato modificato`),
            error => this.snackbar.open(error.error.message)
        );
    }

    deleteUser() {
        return this.service.deleteUserWithConfirmation(this.user)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => this.router.navigate([this.root, 'users'], {replaceUrl: true}),
                err => this.snackbar.open(err.error.message)
            );
    }


    resendToken() {
        this.authService.resendTokenAnonymous(this.user.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => this.snackbar.open('Controlla la mail per verificare il tuo account'),
                error => this.snackbar.open(error.error.message));
    }

    getAvatar() {
        this.service.retrieveImage(this.user.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => {
                this.image_src = `data:${res.type};base64,${res.picByte}`;
                this.cdr.detectChanges();
            }, err => {
                const gender = this.user.gender ? 'woman' : 'man';
                this.image_src = `https://cdn0.iconfinder.com/data/icons/people-and-lifestyle-2/64/fitness-${gender}-lifestyle-avatar-512.png`;
                this.cdr.detectChanges();
            });
    }

    openImageDialog() {
        const dialogRef = this.dialog.open(ImageModalComponent, {
            data: this.image_src
        });
    }
}
