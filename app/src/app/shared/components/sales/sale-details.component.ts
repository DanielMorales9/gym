import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SaleFacade, SnackBarService} from '../../../services';
import {Sale} from '../../model';
import {MatDialog} from '@angular/material';
import {SalesService} from '../../services';
import {SaleHelperService} from '../../services/sale-helper.service';
import {PaySaleModalComponent} from './pay-sale-modal.component';

@Component({
    templateUrl: './sale-details.component.html',
    styleUrls: ['../../../styles/list-items.css', '../../../styles/root.css', '../../../styles/card.css'],
})
export class SaleDetailsComponent implements OnInit {

    sale: Sale;
    hidden: boolean;
    canPay: boolean;
    canDelete: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private helper: SaleHelperService,
                private service: SalesService,
                private facade: SaleFacade,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
        this.canDelete = this.facade.canDelete();
        this.canPay = this.facade.canPay();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.getSale(+params['id']);
        });
    }

    getSale (id) {
        this.helper.findById(id).subscribe((res: Sale) => {
            this.sale = SaleHelperService.extractSalesLineItem(res);
        });
    }

    delete() {
        const confirmed = confirm('Vuoi confermare l\'eliminazione della vendita per il cliente ' +
            this.sale.customer.firstName + ' ' + this.sale.customer.lastName + '?');
        if (confirmed) {
            this.helper.delete(this.sale.id)
                .subscribe(_ => {
                    this.snackbar.open('Vendita eliminata per il cliente ' + this.sale.customer.lastName + '!');
                    return this.router.navigateByUrl('/');
                });
        }
    }

    pay() {
        const dialogRef = this.dialog.open(PaySaleModalComponent, { data: {
            sale: this.sale
            }});

        dialogRef.afterClosed().subscribe(res => {
            if (res) { this.service.pay(res.sale.id, res.amount).subscribe((value: Sale) => this.getSale(value.id));
            }
        });
    }

    goToBundleDetails(id: number) {
        this.router.navigate(['bundles', id], {relativeTo: this.route.parent});
    }
}
