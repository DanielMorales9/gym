import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {BundlesService} from "../../shared/services";
import {Bundle} from "../../shared/model";
import {ExchangeBundleService, NotificationService} from "../../services";

@Component({
    selector: 'bundle-modal',
    templateUrl: './bundle-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class BundleModalComponent implements OnInit {

    @Output()
    modalEvent = new EventEmitter();
    bundle: Bundle;
    loading: boolean;

    @Input() public modalTitle: string;
    @Input() public modalId: string;
    @Input() public modalCloseId: string;
    @Input() public modalClosingMessage: string;
    @Input() public edit: string;

    //TODO: controlla che la validazione funzioni

    constructor(private service: BundlesService,
                private exBundleService: ExchangeBundleService,
                private messageService: NotificationService) {
        this.loading = false;

    }

    ngOnInit(): void {
        this.bundle = {
            id: NaN,
            name: '',
            price: NaN,
            description: undefined,
            numSessions: undefined,
            disabled: false,
            type: 'P'};
        if (this.edit == "true") {
            this.exBundleService.getBundle()
                .subscribe(bundle => {
                    this.bundle = bundle
                })

        }
    }

    _success() {
        return (res) => {
            this.loading = false;
            document.getElementById(this.modalCloseId).click();
            let message ={
                text: "Il pacchetto " + this.bundle.name + this.modalClosingMessage,
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.modalEvent.emit("update");
        }
    }

    _error() {
        return (err) => {
            this.loading = false;
            document.getElementById(this.modalCloseId).click();
            let message ={
                text: "Qualcosa è andato storto",
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    submitBundle() {
        if (this.edit == "true") {
            this.bundle.type = "P";
            this.service.put(this.bundle)
                .subscribe(this._success(), this._error());

        }
        else {
            const bundle = this.bundle;
            delete bundle.id;
            this.service.post(this.bundle)
                .subscribe(this._success(), this._error());
        }
        this.loading = true
    }

}