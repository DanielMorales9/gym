import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TypeNames, User} from '../model';
import {AuthService, SalesService, UserService} from '../../core/controllers';
import {MatDialog} from '@angular/material/dialog';
import {UserModalComponent} from './user-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackBarService} from '../../core/utilities';
import {PolicyServiceDirective} from '../../core/policy';
import {filter, first, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base-component';
import {GetPolicies} from '../policy.interface';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css', '../../styles/details.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent extends BaseComponent implements GetPolicies, OnInit {

    user: User;

    canDelete: boolean;
    canEdit: boolean;
    canSendToken: boolean;

    USER_TYPE = {A: 'admin', T: 'trainer', C: 'customer'};
    private root: string;
    mapNames = TypeNames;

    totalPayed = 0.;
    amountPayed = 0.;
    percentage = 0.;
    percentageType = 'danger';

    constructor(private service: UserService,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private policy: PolicyServiceDirective,
                private dialog: MatDialog,
                private salesService: SalesService,
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
            this.getBalance();
            this.getPolicies();
            this.cdr.detectChanges();
        });
    }

    getPolicies() {
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

    private getBalance() {
        if (this.user.type === 'C') {
            this.salesService.getBalance(this.user.id)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(res => {
                    this.totalPayed = res['totalPayed'];
                    this.amountPayed = res['amountPayed'];
                    this.percentage = Math.floor(this.amountPayed / this.totalPayed * 100);
                    if (this.percentage < 25) {
                        this.percentageType = 'danger';
                    } else if (this.percentage < 50) {
                        this.percentageType = 'warning';
                    } else if (this.percentage < 75) {
                        this.percentageType = 'primary';
                    } else {
                        this.percentageType = 'success';
                    }
                    this.cdr.detectChanges();
                });
        }
    }
}
