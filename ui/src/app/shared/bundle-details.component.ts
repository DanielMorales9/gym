import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ExchangeBundleService} from "../core/services/exchange-bundle.service";
import {ChangeViewService} from "../core/services/change-view.service";
import {AppService} from "../core/services/app.service";
import {Bundle} from "../core/model/bundle.class";
import {BundlesService} from "../core/services/bundles.service";

@Component({
    selector: 'bundle-details',
    templateUrl: './bundle-details.component.html',
    styleUrls: ['../app.component.css']
})
export class BundleDetailsComponent implements OnInit {

    @Input() public bundle: Bundle;
    @Input() public classMode: string;
    @Input() public mode: string;

    @Output() private event = new EventEmitter();
    hidden: boolean;
    current_role_view: number;

    constructor(private service: BundlesService,
                private app: AppService,
                private changeViewService: ChangeViewService,
                private exchangeBundleService: ExchangeBundleService) {
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.hidden = false;
    }

    toggle() {
        this.hidden = !this.hidden
    }

    toggleDisabled() {
        const bundle = this.bundle;
        bundle.type = "P";
        bundle.disabled = !bundle.disabled;
        this.service.put(bundle, undefined, undefined);
    }

    editBundle() {
        this.exchangeBundleService.sendBundle(this.bundle)
    }

    emitBundle() {
        this.event.emit(this.bundle)
    }


}