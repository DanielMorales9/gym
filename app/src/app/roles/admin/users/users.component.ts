import {Component} from '@angular/core';
import {User} from "../../../shared/model";
import {UserHelperService, UserService} from "../../../shared/services";
import {AppService, ChangeViewService} from "../../../services";
import {UserCreateModalComponent} from "./user-create-modal.component";
import {MatDialog} from "@angular/material";
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {UserPatchModalComponent} from "../../../shared/components/users";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../../search-and-list.css']
})
export class UsersComponent {

    SIMPLE_NO_CARD_MESSAGE = "Nessun utente registrato";
    // SEARCH_NO_CARD_MESSAGE = "Nessun utente registrato con questo nome";

    current_role_view: number;
    private pageSize: number = 10;

    query: string;
    ds: UserDataSource;

    constructor(private service: UserService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private app: AppService,
                private dialog: MatDialog) {
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
        this.ds = new UserDataSource(this.service, this.pageSize, this.query);
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(UserCreateModalComponent);

        dialogRef.afterClosed().subscribe(_ => {
            this.getUsers()
        });
    }

    openEditDialog(u: User) {
        const dialogRef = this.dialog.open(UserPatchModalComponent, {
            data: {
                user: u
            }
        });

        dialogRef.afterClosed().subscribe(_ => {
            this.getUsers()
        });
    }

    getUsers() {
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
    }

    deleteUser(u: User) {
        let confirmed = confirm(`Vuoi eliminare l'utente ${u.firstName} ${u.lastName}?`);
        if (confirmed) {
            this.service.delete(u.id).subscribe(_ => this.getUsers())
        }
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
        if (this.query === undefined || this.query == '') {
            this.service.get(page, this.pageSize).subscribe(res => {
                let newLenght = res['page']['totalElements'];
                if (this.length != newLenght) {
                    this.length = newLenght;
                    this.cachedData = Array.from<User>({length: this.length});
                }

                let users = UserHelperService.unwrapUsers(res);
                this.empty = users.length == 0;
                this.cachedData.splice(page * this.pageSize, this.pageSize, ...users);
                this.dataStream.next(this.cachedData);
            })
        }
        else {

            this.service.search(this.query, page, this.pageSize).subscribe(res => {
                let newLenght = res['totalElements'];
                if (this.length != newLenght) {
                    this.length = newLenght;
                    this.cachedData = Array.from<User>({length: this.length});
                }

                let users = res['content'];
                this.empty = users.length == 0;
                this.cachedData.splice(page * this.pageSize, this.pageSize, ...users);
                this.dataStream.next(this.cachedData);
            })
        }
    }
}