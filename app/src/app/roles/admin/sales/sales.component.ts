import {Component} from '@angular/core';
import {Sale} from '../../../shared/model';
import {Router} from '@angular/router';
import {SaleHelperService} from '../../../shared/services/sale-helper.service';
import {QueryableDatasource, SalesService} from '../../../shared/services';
import {AppService, SnackBarService} from '../../../services';


@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css']
})
export class SalesComponent {

    private SIMPLE_NO_CARD_MESSAGE = "Nessuna vendita disponibile";
    // private SEARCH_NO_CARD_MESSAGE = "Nessuna vendita disponibile con questa query";

    query: string;

    current_role_view: number;
    no_card_message: string;

    private pageSize: number = 10;
    ds: QueryableDatasource<Sale>;

    constructor(private helper: SaleHelperService,
                private service: SalesService,
                private app: AppService,
                private router: Router,
                private snackbar: SnackBarService) {
        this.no_card_message = this.SIMPLE_NO_CARD_MESSAGE;
        this.current_role_view = app.current_role_view;

        this.ds = new QueryableDatasource<Sale>(helper, this.pageSize, this.query);
    }

    // TODO enable mixed queries (date or text)

    search($event?) {
        if ($event)
            this.query = $event.query;
        this.ds.setQuery(this.query);
        this.ds.fetchPage(0);
    }

    handleEvent($event) {
        switch ($event.type) {
            case 'delete':
                this.deleteSale($event.sale);
                break;
            case 'pay':
                this.paySale($event.sale, $event.amount);
                break;
        }
    }

    private deleteSale(sale: Sale) {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            sale.customer.firstName + " " + sale.customer.lastName + "?");
        if (confirmed) {
            this.helper.delete(sale.id)
                .subscribe( _ => {
                    this.snackbar.open("Vendita eliminata per il cliente " + sale.customer.lastName + "!");
                    return this.search()
                }, err => this.snackbar.open(err.error.message))
        }
    }

    private paySale(sale: Sale, amount: number) {
        this.service.pay(sale.id, amount)
            .subscribe(_ => this.search());
    }
}
