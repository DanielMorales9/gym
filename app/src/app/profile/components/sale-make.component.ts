import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
    BundlesService,
    SalesService,
    UserService
} from "../../shared/services";
import {Bundle, User} from "../../shared/model";
import {PagerComponent} from "../../shared/components";
import {AppService} from "../../app.service";
import {ChangeViewService, NotificationService} from "../../services";


@Component({
    templateUrl: './sale-make.component.html',
    styleUrls: ['../../app.component.css'],
})
export class MakeSaleComponent implements OnInit {

    @ViewChild(PagerComponent)
    private pagerComponent: PagerComponent;

    current_role_view: number;
    sub: any;
    id : number;
    query: string;
    empty: boolean;
    bundles: Bundle[];
    admin: User;

    soldBundles = [];
    sale: any;

    constructor(private app: AppService,
                private router: Router,
                private bundleService: BundlesService,
                private saleService: SalesService,
                private userService: UserService,
                private changeViewService: ChangeViewService,
                private messageService: NotificationService,
                private route: ActivatedRoute) {
        this.current_role_view = this.app.current_role_view;
        this.admin = this.app.user;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    ngOnInit(): void {
        this.findBundles();
        this.pagerComponent.setSize(3);
        this.sub = this.route.parent.params.subscribe(params => {
            this.id = +params['id?'];
            this.makeSale()
        });


        window.onbeforeunload = (ev) => {
            this.destroy();
        };
    }

    private makeSale() {
        this.saleService.createNewSale(this.admin.email, this.id)
            .subscribe(res => {
                this.sale = res;
                this.messageService.sendMessage({
                    text: "Vendita Iniziata!",
                    class: "alert-info",
                    delay: 1000
                })
            }, this._systemError())
    }

    _systemError() {
        return err => {
            console.log(err);
            let message ={
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    ngOnDestroy() {
        this.destroy();
    }

    private destroy() {
        this.sub.unsubscribe();
        if (this.sale) {
            if (!this.sale.completed) {
                this.saleService.delete(this.sale.id)
                    .subscribe( res => {
                        this.messageService.sendMessage({
                            text: "Vendita Eliminata!",
                            class: "alert-warning",
                            delay: 1000})
                    }, this._systemError())
            }
        }
    }

    _success () {
        return (res) => {
            this.bundles = res['content'];
            this.pagerComponent.setTotalPages(res['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.bundles == undefined || this.bundles.length == 0;
        }
    }

    _error () {
        return (err) => {
            this.empty = true;
            this.pagerComponent.setTotalPages(0)
        }
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
        this.bundleService.searchNotDisabled(this.query,
            this.pagerComponent.getPage(),
            this.pagerComponent.getSize()).subscribe( res => {
            this.bundles = res['content'];
            this.pagerComponent.setPageNumber(res['number']);
            this.pagerComponent.setTotalPages(res['totalPages']);
            this.pagerComponent.updatePages();
            this.empty = this.bundles == undefined || this.bundles.length == 0;
            this.pagerComponent.setTotalPages(0)
        }, this._error())
    }

    getBundlesByPage() {
        if (this.query === undefined || this.query == ''){
            this.bundleService.getNotDisabled(
                this.pagerComponent.getPage(),
                this.pagerComponent.getSize())
                .subscribe(this._success(), this._error());
        }
        else {
            this.searchByPage();
        }
    }

    addBundle($event) {
        let bundle = $event;
        this.soldBundles.push(bundle);
        this.saleService.addSalesLineItem(this.sale.id, bundle.id)
            .subscribe( res=>{
                this.sale = res;
                this.messageService.sendMessage({
                    text: "Pacchetto " + bundle.name + " aggiunto al Carrello!",
                    class: "alert-info",
                    delay: 1000
                })
            }, this._systemError())
    }

    deleteBundle($event) {
        let bundle = $event;
        let i = this.soldBundles.indexOf(bundle);

        let id = this.sale
            .salesLineItems
            ._embedded
            .salesLineItemResources
            .map(line => [line.id, line.bundleSpecification.id])
            .filter(line => line[1] == bundle.id)
            .map(line => line[0])[0];
        this.saleService.deleteSalesLineItem(this.sale.id, id)
            .subscribe( res => {
                if (i > -1) {
                    this.soldBundles.splice(i, 1);
                }
                this.sale = res;
                this.messageService.sendMessage({
                    text: "Pacchetto " + bundle.name + " rimosso dal Carrello!",
                    class: "alert-warning",
                    delay: 1000
                });
            }, this._systemError());
    }

    confirmSale() {
        this.saleService.confirmSale(this.sale.id)
            .subscribe( res => {
                this.sale = res;
                this.messageService.sendMessage({
                    text: "Vendita Confermata!",
                    class: "alert-primary",
                    delay: 1000
                });
                this.router.navigate(['../summarySale', this.sale.id], {relativeTo: this.route });
            }, this._systemError())
    }
}