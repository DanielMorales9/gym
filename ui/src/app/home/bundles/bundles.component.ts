import {Component, OnInit, ViewChild} from '@angular/core';
import {Bundle} from "../../core/model/bundle.class";
import {PagerComponent} from "../../shared/pager.component";
import {BundlesService} from "../../core/services/bundles.service";

@Component({
    templateUrl: './bundles.component.html',
    styleUrls: ['../../app.component.css']
})
export class BundlesComponent implements OnInit {

    query: string;

    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;

    empty: boolean;

    bundles: Bundle[];

    private BUNDLE_FIELD = 'aTrainingBundleSpecifications';

    constructor(private service: BundlesService) {
    }

    ngOnInit(): void {
        this.getBundlesByPage();
    }

    _success () {
        return (res) => {
            this.bundles = res['_embedded'][this.BUNDLE_FIELD];
            this.pagerComponent.setTotalPages(res['page']['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.bundles == undefined || this.bundles.length == 0;
            this.pagerComponent.setEmpty(this.empty)
        }
    }

    _error () {
        return (err) => {
            this.empty = true;
            this.pagerComponent.setEmpty(this.empty)
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
            this.pagerComponent.getSize(), res => {
            this.bundles = res['content'];
            this.pagerComponent.setPageNumber(res['number']);
            this.pagerComponent.setTotalPages(res['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.bundles == undefined || this.bundles.length == 0;
            this.pagerComponent.setEmpty(this.empty)
        }, this._error())
    }

    getBundlesByPage() {
        if (this.query === undefined || this.query == ''){
            this.service.get(
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize(),
                this._success(),
                this._error());
        }
        else {
            this.searchByPage();
        }

    }

}
