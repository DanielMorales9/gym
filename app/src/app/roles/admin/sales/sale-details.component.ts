import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DateService, SaleHelperService, SnackBarService} from '../../../services';
import {Sale, User} from '../../../shared/model';
import {MatDialog} from '@angular/material';
import {SalesModalComponent} from './sales-modal.component';

@Component({
    templateUrl: './sale-details.component.html',
    styleUrls: ['../../../styles/list-items.css', '../../../styles/root.css', '../../../styles/card.css'],
})
export class SaleDetailsComponent implements OnInit {

    sale: Sale;
    hidden: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private saleHelperService: SaleHelperService,
                private dateService: DateService,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.getSale(+params['id'])
        })
    }

    getDate(d) {
        return this.dateService.getStringDate(d);
    }

    getSale (id) {
        this.saleHelperService.findById(id)
            .subscribe((res: Sale) => {
                this.sale = res;
                console.log(res);
                if (!this.sale.customer) this.sale.customer = new User();
                if (!this.sale.salesLineItems) this.sale.salesLineItems = [];
                this.saleHelperService.getCustomer(this.sale);
                this.saleHelperService.getSaleLineItems(this.sale);
            })
    }

    delete() {
        let confirmed = confirm("Vuoi confermare l'eliminazione della vendita per il cliente " +
            this.sale.customer.firstName + " " + this.sale.customer.lastName + "?");
        if (confirmed) {
            this.saleHelperService.delete(this.sale.id)
                .subscribe( res => {
                    this.snackbar.open("Vendita eliminata per il cliente " + this.sale.customer.lastName + "!");
                    return this.router.navigateByUrl('/')
                })
        }
    }

    pay() {
        const dialogRef = this.dialog.open(SalesModalComponent, { data: {
            sale: this.sale
            }});

        dialogRef.afterClosed().subscribe(_ => this.getSale(this.sale.id));
    }
}
