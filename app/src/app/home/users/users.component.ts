import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/model";
import {UserHelperService, UserService} from "../../shared/services";
import {AppService} from "../../services";
import {ChangeViewService} from "../../services";
import {UserCreateModalComponent} from "./user-create-modal.component";
import {MatDialog} from "@angular/material";
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../root.css']
})
export class UsersComponent {

    SIMPLE_NO_CARD_MESSAGE = "Nessun utente registrato";
    // SEARCH_NO_CARD_MESSAGE = "Nessun utente registrato con questo nome";

    current_role_view: number;
    private pageSize: number = 5;

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

    getUsers() {
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
    }
}

export class UserDataSource extends DataSource<User> {
    private fetchedPages = new Set<number>();
    private subscription = new Subscription();
    private cachedData = new Array<User>();
    private dataStream = new BehaviorSubject<User[]>(this.cachedData);
    empty: boolean = false;

    constructor(private service: UserService,
                private pageSize: number,
                private query: string) {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<User[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
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
    }

    private search(page: number) {
        if (this.query === undefined || this.query == ''){

            this.service.get(page, this.pageSize)
                .subscribe(res => {
                    let users = UserHelperService.wrapUsers(res);
                    this.cachedData.splice(page * this.pageSize, ...users);
                    this.empty = users.length == 0;
                    this.dataStream.next(users);
                })
        }
        else {

            this.service.search(this.query, page, this.pageSize)
                .subscribe(res => {
                    let users = res['content'];
                    this.cachedData.splice(page * this.pageSize, ...users);
                    this.empty = users.length == 0;
                    this.dataStream.next(users);
                })
        }
    }
}