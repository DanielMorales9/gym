import {Component} from '@angular/core';
import {User} from '../../../shared/model';
import {UserHelperService, UserService} from '../../../shared/services';
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
    ds: UserDataSource;

    constructor(private service: UserService,
                private router: Router,
                private route: ActivatedRoute,
                private app: AppService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
        this.currentUserId = this.app.user.id;
        this.ds = new UserDataSource(this.service, this.pageSize, this.query);
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

export class UserDataSource extends DataSource<User | undefined> {
    private length = 1;
    private fetchedPages = new Set<number>();
    private subscription = new Subscription();
    private cachedData = Array.from<User>({length: this.length});
    private dataStream = new BehaviorSubject<User[]>(this.cachedData);
    empty: boolean = false;

    constructor(private service: UserService,
                private pageSize: number,
                private query: string) {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<(User | undefined)[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            let end = (this.length < range.end-1) ? this.length : range.end - 1;
            const endPage = this.getPageForIndex(end);
            for (let i = startPage; i <= endPage; i++) {
                this.fetchPage(i);
            }
        }));

        this.fetchPage(0);
        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);
        this.search(page)
    }

    setQuery(query: string) {
        this.query = query;
        this.fetchedPages = new Set<number>();
        this.cachedData = [];
        this.fetchPage(0)
    }

    private search(page: number) {
        let observable;
        if (this.query === undefined || this.query == '')
            observable = this.service.get(page, this.pageSize);

        else
            observable = this.service.search(this.query, page, this.pageSize);

        observable.subscribe(res => {
            let newLength = UserDataSource.getLength(res);
            if (this.length != newLength) {
                this.length = newLength;
                this.cachedData = Array.from<User>({length: this.length});
            }

            let users = UserHelperService.unwrapUsers(res);
            this.empty = users.length == 0;
            this.cachedData.splice(page * this.pageSize, this.pageSize, ...users);
            this.dataStream.next(this.cachedData);
        })
    }

    private static getLength(res) {
        let newLength;
        if (res['page'])
            newLength = res['page']['totalElements'];
        else newLength = res['totalElements'];
        return newLength;
    }
}
