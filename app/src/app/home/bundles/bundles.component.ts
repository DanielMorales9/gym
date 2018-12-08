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
    empty: boolean;
    no_card_message: string;


    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;

    bundles: Bundle[];

    constructor(private service: BundlesService) {
        this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
    }

    ngOnInit(): void {
        this.getBundlesByPage();
    }

    private _success () {
        return (res) => {
            this.bundles = res['_embedded'][this.BUNDLE_FIELD] as Bundle[];
            this.pagerComponent.setTotalPages(res['page']['totalPages']);
            this.pagerComponent.updatePages();
            this.setEmpty()
        }
    }

    private _error () {
        return (_) => {
            this.empty = true;
            this.pagerComponent.setTotalPages(0);
        }
    }

    private _complete () {
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
        else this.searchByPage();
    }

    private searchByPage() {
        this.service.search(this.query,
            this.pagerComponent.getPage(),
            this.pagerComponent.getSize())
            .subscribe( res => {
                this.bundles = res['content'] as Bundle[];
                this.pagerComponent.setPageNumber(res['number']);
                this.pagerComponent.setTotalPages(res['totalPages']);
                this.pagerComponent.updatePages();
                this.setEmpty();
            }, this._error(), this._complete())
    }

    private setEmpty() {
        this.empty = this.bundles == undefined || this.bundles.length == 0;
    }

    getBundlesByPage() {
        if (this.query === undefined || this.query == '')
            this.service.get(
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error(), this._complete());
        else this.searchByPage();
    }

}
