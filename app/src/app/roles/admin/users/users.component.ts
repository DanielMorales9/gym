import {Component} from '@angular/core';
import {User} from '../../../shared/model';
import {QueryableDatasource, UserHelperService, UserService} from '../../../shared/services';
import {AppService, AuthService, SnackBarService} from '../../../services';
import {MatDialog} from '@angular/material';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModalComponent} from '../../../shared/components/users';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../../styles/search-list.css']
})
export class UsersComponent {

    SIMPLE_NO_CARD_MESSAGE = "Nessun utente registrato";
    // SEARCH_NO_CARD_MESSAGE = "Nessun utente registrato con questo nome";

    currentUserId: number;

    query: string;
    private pageSize: number = 10;
    ds: QueryableDatasource<User>;

    constructor(private service: UserService,
                private helper: UserHelperService,
                private router: Router,
                private route: ActivatedRoute,
                private app: AppService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
        this.currentUserId = this.app.user.id;
        this.ds = new QueryableDatasource<User>(this.helper, this.pageSize, this.query);
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(UserModalComponent, {
            data : {
                title: 'Registra Nuovo Utente',
                method: 'post'
            },
        });

        dialogRef.afterClosed().subscribe(user => {
            if (user) this.createUser(user)
        });
    }

    search($event?) {
        if ($event)
            this.query = $event.query;
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
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
        this.service.delete(user.id).subscribe(_ => {
            this.search()
        });
    }

    private patchUser(user: User) {
        this.service.patch(user).subscribe( _ => {
            this.snackbar.open(`L'utente ${user.lastName} è stato modificato`);
        }, err => {
            this.snackbar.open(err.error.message);
        }, () => {
            this.search()
        })
    }

    private createUser(user: User) {
        this.authService.registration(user).subscribe(_ => {
            let message = `L'utente ${user.lastName} è stato creato`;
            this.snackbar.open(message);
        },  err => {
            if (err.status == 500) {
                this.snackbar.open(err.error.message, );
            }
            else throw err;
        }, () => {
            this.search();
        })
    }
}
