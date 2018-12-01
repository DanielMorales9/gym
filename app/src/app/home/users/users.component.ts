import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/model";
import {PagerComponent} from "../../shared/components";
import { ChangeViewService, UserService} from "../../shared/services";
import {AppService} from "../../app.service";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['../../app.component.css']
})
export class UsersComponent implements  OnInit {

    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;

    users: User[];
    current_role_view: number;
    empty: boolean;
    query: string;

    constructor(private service: UserService,
                private changeViewService: ChangeViewService,
                private app: AppService) {
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.getUsersByPage();
    }

    private searchByPage() {
        this.service.search(this.query,
            this.getPage(),
            this.getSize()).subscribe(res => {
                this.users = res['content'];
                this.pagerComponent.setPageNumber(res['number']);
                this.pagerComponent.setTotalPages(res['totalPages']);
                this.pagerComponent.updatePages();
                this.empty = this.users == undefined || this.users.length == 0;
            }, this._error())
    }

    private getSize() {
        return this.pagerComponent.getSize();
    }

    private getPage() {
        return this.pagerComponent.getPage();
    }

    _success () {
        return (res) => {
            this.users = [];
            if (res['_embedded']['admins']) {
                this.users = this.users.concat(res['_embedded']['admins'])
            }
            if (res['_embedded']['customers']) {
                this.users = this.users.concat(res['_embedded']['customers'])
            }
            if (res['_embedded']['trainers']) {
                this.users = this.users.concat(res['_embedded']['trainers'])
            }
            this.pagerComponent.setTotalPages(res['page']['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.users == undefined || this.users.length == 0;
        }
    }

    _error () {
        return (err) => {
            this.empty = true;
            this.pagerComponent.setTotalPages(0)
        }
    }


    getUsersByPage() {
        this.service.get(
            this.getPage(),
            this.getSize()).subscribe(this._success(), this._error())
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
