import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/model";
import {PagerComponent} from "../../shared/components";
import {UserHelperService, UserService} from "../../shared/services";
import {AppService} from "../../services";
import {ChangeViewService} from "../../services";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../app.component.css']
})
export class UsersComponent implements  OnInit {

    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;

    private SIMPLE_NO_CARD_MESSAGE = "Nessun utente registrato";
    private SEARCH_NO_CARD_MESSAGE = "Nessun utente registrato con questo nome";

    users: User[];
    no_card_message: string;
    current_role_view: number;
    empty: boolean;
    query: string;

    constructor(private service: UserService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private app: AppService) {
        this.current_role_view = this.app.current_role_view;
        this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        })
    }

    ngOnInit(): void {
        this.getUsersByPage();
    }

    private searchByPage() {
        this.service.search(this.query,
            this.getPage(),
            this.getSize()).subscribe(res => {
                this.users = res['content'] as User[];
                this.pagerComponent.setPageNumber(res['number']);
                this.pagerComponent.setTotalPages(res['totalPages']);
                this.pagerComponent.updatePages();
                this.setEmpty()
        }, this._error(), this._complete())
    }

    private getSize() {
        return this.pagerComponent.getSize();
    }

    private getPage() {
        return this.pagerComponent.getPage();
    }

    private _success () {
        return (res) => {
            this.users = UserHelperService.wrapUsers(res);
            this.pagerComponent.setTotalPages(res['page']['totalPages']);
            this.pagerComponent.updatePages();
            this.setEmpty();
        }
    }

    private setEmpty() {
        this.empty = this.users == undefined || this.users.length == 0;
    }

    private _error () {
        return (err) => {
            this.empty = true;
            this.pagerComponent.setTotalPages(0);
        }
    }

    private _complete() {
        return () => {
            if (this.empty) {
                if (this.query === undefined || this.query == '') {
                    this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
                }
                else {
                    this.no_card_message = this.SEARCH_NO_CARD_MESSAGE;
                }
            }
        }
    }

    getUsersByPage() {
        this.service.get(
            this.getPage(),
            this.getSize()).subscribe(this._success(), this._error(), this._complete())
    }

    findUsers() {
        if (this.query === undefined || this.query == ''){
            this.pagerComponent.setPageNumber(0);
            this.getUsersByPage()
        }
        else {
            this.searchByPage();
        }
    }
}
