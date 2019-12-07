import {Component, OnInit} from '@angular/core';
import {User} from '../../model';
import {QueryableDatasource, UserHelperService, UserService} from '../../services';
import {AppService, AuthService, GymService, SnackBarService} from '../../../services';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModalComponent} from './user-modal.component';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../../styles/search-list.css']
})
export class UsersComponent implements OnInit {

    SIMPLE_NO_CARD_MESSAGE = 'Nessun utente registrato';
    // SEARCH_NO_CARD_MESSAGE = "Nessun utente registrato con questo nome";

    currentUserId: number;

    query: string;
    private pageSize = 10;
    private queryParams: any;
    ds: QueryableDatasource<User>;
    canAdd: boolean;
    canDelete: boolean;
    canPatch: boolean;
    type: string;

    constructor(private service: UserService,
                private helper: UserHelperService,
                private gymService: GymService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private app: AppService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
        this.currentUserId = this.app.user.id;
        this.ds = new QueryableDatasource<User>(this.helper, this.pageSize, this.query);
    }


    ngOnInit(): void {
        this.type = this.activatedRoute.parent.parent.snapshot.routeConfig.path;
        switch (this.type) {
            case 'admin':
                this.canPatch = this.canDelete = this.canAdd = true;
                break;
            case 'trainer':
                this.canPatch = this.canDelete = this.canAdd = false;
                break;
        }
        this.initQueryParams();
    }

    private initQueryParams() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.queryParams = Object.assign({}, params);
            if (Object.keys(params).length > 0) {
                this.query = this.queryParams.query || undefined;
            }
            this.search(this.queryParams);
        });
    }

    private updateQueryParams($event?) {
        this.queryParams = $event;
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
            });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(UserModalComponent, {
            data : {
                title: 'Registra Nuovo Utente',
                method: 'post'
            },
        });

        dialogRef.afterClosed().subscribe(user => {
            if (user) { this.createUser(user); }
        });
    }

    search($event?) {
        if ($event) {if (!$event.query) { $event = {}; }}
        if (this.type === 'trainer') { $event.type = this.type; }
        this.ds.setQuery($event);
        this.ds.fetchPage(0);
        this.updateQueryParams($event);
    }

    handleEvent($event: any) {
        switch ($event.type) {
            case 'delete':
                this.deleteUser($event.user);
                break;
            case 'patch':
                this.patchUser($event.user);
                break;
        }
    }

    private deleteUser(user: User) {
        const confirmed = confirm(`Vuoi rimuovere l'utente ${user.firstName} ${user.lastName}?`);
        if (confirmed) {
            this.service.delete(user.id).subscribe(_ => {
                this.search();
            }, err => {
                this.snackbar.open(err.error.message);
            });
        }
    }

    private patchUser(user: User) {
        this.service.patch(user).subscribe( _ => {
            this.snackbar.open(`L'utente ${user.lastName} è stato modificato`);
        }, err => {
            this.snackbar.open(err.error.message);
        }, () => {
            this.search();
        });
    }

    private createUser(user: User) {
        this.authService.registration(user).subscribe(_ => {
            const message = `L'utente ${user.lastName} è stato creato`;
            this.snackbar.open(message);
        },  err => {
            if (err.status === 500) {
                this.snackbar.open(err.error.message);
            } else { throw err; }
        }, () => {
            this.search();
        });
    }

    itsMe(id: any) {
        return this.currentUserId !== id;
    }
}
