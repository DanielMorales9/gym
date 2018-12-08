import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagerComponent} from "../pager.component";
import {SalesService} from "../../services";
import {AppService} from "../../../app.service";
import {ChangeViewService, SaleHelperService} from "../../../services";
import {Sale, User} from "../../model";


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../../app.component.css']

})
export class SalesComponent implements OnInit {

    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;
    private SIMPLE_NO_CARD_MESSAGE = "Nessuna vendita disponibile";
    private SEARCH_NO_CARD_MESSAGE = "Nessuna vendita disponibile con questa query";

    sales: Sale[];
    empty: boolean;
    id: number;
    query: string;
    current_role_view: number;
    no_card_message: string;

    constructor(private service: SalesService,
                private saleHelperService: SaleHelperService,
                private app: AppService,
                private changeViewService: ChangeViewService,
                private route: ActivatedRoute) {
        this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
        this.current_role_view = app.current_role_view;
        this.id = undefined;

        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.sales = [];
        this.route.parent.params.subscribe(params => {
            this.id = +params['id?'];
            if (this.id) {
                this.service.findUserSales(this.id,
                    this.pagerComponent.getPage(),
                    this.pagerComponent.getSize())
                    .subscribe(this._success('user'), this._error())
            }
            else {
                this.getSalesByPage();
            }
        })
    }

    _success (type: string) {
        return (res) => {
            if (type === 'search' && res['totalElements'] === 0)
                this.no_card_message = this.SEARCH_NO_CARD_MESSAGE;
            let content = res['_embedded'] || res['content'];
            content = content['sales'] || content;
            let page = res['page'] || res;
            this.sales = content;
            this.sales.forEach(value => {
                if (!value.customer) value.customer = new User();
                if (!value.salesLineItems) value.salesLineItems = [];
            });
            this.pagerComponent.setTotalPages(page['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.sales == undefined || this.sales.length == 0;
        }
    }

    private err() {
        this.sales = [];
        this.empty = true;
        this.pagerComponent.setTotalPages(0)
    }

    _error () {
        return (err) => {
            this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
            this.err()
        }
    }

    _searchError () {
        return (err) => {
            this.no_card_message = this.SEARCH_NO_CARD_MESSAGE;
            this.err()
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
                .subscribe(this._success('all'), this._error())
        } else {
            this.service.findUserSales(this.id,
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success('user'), this._error())
        }
    }

    searchByPage() {
        if (!this.id) {
            this.service.searchByLastName(this.query,
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success('search'), this._searchError())
        } else {
            this.service.searchByDate(this.query, this.id,
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success('search'), this._searchError())
        }
    }


}
