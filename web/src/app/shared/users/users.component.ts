import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {User} from '../model';
import {AuthService, UserService} from '../../core/controllers';
import {GymService} from '../../services';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModalComponent} from './user-modal.component';
import {AuthenticationService} from '../../core/authentication';
import {SnackBarService} from '../../core/utilities';
import {QueryableDatasource, UserHelperService} from '../../core/helpers';
import {PolicyService} from '../../core/policy';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SearchComponent} from '../search-component';
import {Policy} from '../policy.interface';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../styles/search-list.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent extends SearchComponent<User> implements Policy, OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun utente registrato';

    currentUserId: number;

    query = {name: ''};

    canCreate: boolean;
    canDelete: boolean;
    canEdit: boolean;
    type: string;

    constructor(private service: UserService,
                private helper: UserHelperService,
                private gymService: GymService,
                protected router: Router,
                protected route: ActivatedRoute,
                private auth: AuthenticationService,
                private authService: AuthService,
                private policy: PolicyService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
        super(router, route);
        this.auth.getObservableCurrentUserRoleId()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => this.currentUserId = v);
        this.ds = new QueryableDatasource<User>(this.helper, this.query);
    }

    ngOnInit(): void {
        this.type = this.route.parent.parent.snapshot.routeConfig.path;
        this.getPolicies();
        this.initQueryParams();
    }

    getPolicies() {
        this.canDelete = this.policy.get('user', 'canDelete');
        this.canCreate = this.policy.get('user', 'canCreate');
        this.canEdit = this.policy.get('user', 'canEdit');
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(UserModalComponent, {
            data : {
                title: 'Registra Nuovo Utente',
                method: 'post'
            },
        });

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(r => this.createUser(r))
            )
            .subscribe(user => {
                const message = `L'utente ${user.lastName} è stato creato`;
                this.snackbar.open(message);
                this.dataSourceSearch();
            }, err => this.snackbar.open(err.error.message));
    }

    handleEvent($event: any) {
        switch ($event.type) {
            case 'delete':
                this.deleteUser($event.user);
                break;
            case 'patch':
                this.patchUser($event.user);
                break;
            case 'info':
                this.goToDetails($event.user);
                break;
        }
    }

    private deleteUser(user: User) {
        return this.service.deleteUserWithConfirmation(user)
            .subscribe(res => this.dataSourceSearch(),
                err => this.snackbar.open(err.error.message)
            );
    }

    private patchUser(user: User) {
        this.service.patchUser(user).subscribe((res: User) => {
                this.snackbar.open(`L'utente ${res.lastName} è stato modificato`);
                this.dataSourceSearch();
            },
            error => this.snackbar.open(error.error.message)
        );
    }

    private createUser(user: User): Observable<any> {
        return this.authService.registration(user);
    }

    itsMe(id: any) {
        return this.currentUserId !== id;
    }

    private goToDetails(user: any) {
        return this.router.navigate([this.type, 'users', user.id]);
    }

    trackBy(index, item) {
        return item ? item.id : index;
    }
}
