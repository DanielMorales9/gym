import {Component, OnInit, ViewChild} from '@angular/core';
import {Bundle} from "../../shared/model";
import {PagerComponent} from "../../shared/components";
import {BundlesService} from "../../shared/services";

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../app.component.css']
})
export class BundlesComponent implements OnInit {

    private BUNDLE_FIELD = 'aTrainingBundleSpecifications';
    private SIMPLE_NO_CARD_MESSAGE = "Nessun pacchetto disponibile";
    private SEARCH_NO_CARD_MESSAGE = "Nessun pacchetto disponibile con questo nome";

    query: string;
    noCardMessage: string;
    empty: boolean;


    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;


    bundles: Bundle[];


    constructor(private service: BundlesService) {
        this.noCardMessage=this.SIMPLE_NO_CARD_MESSAGE;
    }

    ngOnInit(): void {
        this.getBundlesByPage();
    }

    _success () {
        return (res) => {
            if (res['page']['totalElement'] == 0)
                this.noCardMessage=this.SIMPLE_NO_CARD_MESSAGE;
            this.bundles = res['_embedded'][this.BUNDLE_FIELD];
            this.pagerComponent.setTotalPages(res['page']['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.bundles == undefined || this.bundles.length == 0;
        }
    }

    _error () {
        return (err) => {
            console.log(err);
            this.empty = true;
            this.pagerComponent.setTotalPages(0);
        }
    }

    delayedFindBundles() {
        let that = this;
        setTimeout(function() {
            that.findBundles();
        }, 2000)
    }

    findBundles() {
        if (this.query === undefined || this.query == ''){
            this.pagerComponent.setPageNumber(0);
            this.getBundlesByPage()
        }
        else {
            this.searchByPage();
        }
    }

    private searchByPage() {
        this.service.search(this.query,
            this.pagerComponent.getPage(),
            this.pagerComponent.getSize())
            .subscribe( res => {
                if (res['totalElements'] === 0)
                    this.noCardMessage = this.SEARCH_NO_CARD_MESSAGE;
                this.bundles = res['content'];
                this.pagerComponent.setPageNumber(res['number']);
                this.pagerComponent.setTotalPages(res['totalPages']);
                this.pagerComponent.updatePages();
                this.empty = this.bundles == undefined || this.bundles.length == 0;
            }, this._error())
    }

    getBundlesByPage() {
        if (this.query === undefined || this.query == ''){
            this.service.get(
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error());
        }
        else {
            this.searchByPage();
        }

    }

}
