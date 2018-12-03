import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagerComponent} from "../pager.component";
import {SalesService} from "../../services";
import {AppService} from "../../../app.service";
import {ChangeViewService} from "../../../services/change-view.service";


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../../app.component.css']

})
export class SalesComponent implements OnInit {

    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;

    sales: any[];
    empty: boolean;
    id: number;
    query: string;
    current_role_view: number;

    constructor(private service: SalesService,
                private app: AppService,
                private changeViewService: ChangeViewService,
                private route: ActivatedRoute) {
        this.current_role_view = app.current_role_view;
        this.id = undefined;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.route.parent.params.subscribe(params => {
            this.id = +params['id?'];
            if (this.id) {
                this.service.findUserSales(this.id,
                    this.pagerComponent.getPage(),
                    this.pagerComponent.getSize())
                    .subscribe(this._success(), this._error())
            }
            else {
                this.getSalesByPage();
            }
        })
    }

    _success () {
        return (res) => {
            console.log(res);
            let content = res['_embedded'] || res['content'];
            content = content['sales'] || content;
            let page = res['page'] || res;
            this.sales = content;
            this.pagerComponent.setTotalPages(page['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.sales == undefined || this.sales.length == 0;
        }
    }

    _error () {
        return (err) => {
            this.sales = [];
            this.empty = true;
            this.pagerComponent.setTotalPages(0)
        }
    }

    delayedFindSales() {
        let that = this;
        setTimeout(function() {
            that.findSales();
        }, 2000)
    }

    findSales() {
        if (this.query === undefined || this.query == ''){
            this.pagerComponent.setPageNumber(0);
            this.getSalesByPage()
        }
        else {
            this.searchByPage();
        }
    }

    getSalesByPage() {
        if (!this.id) {
            this.service.get(
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error())
        } else {
            this.service.findUserSales(this.id,
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error())
        }
    }

    searchByPage() {
        if (!this.id) {
            this.service.searchByLastName(this.query,
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error())
        } else {
            this.service.searchByDate(this.query, this.id,
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error())
        }
    }


}
