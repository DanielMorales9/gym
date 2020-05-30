import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Sale} from '../model';
import {MatDialog} from '@angular/material';
import {SalesService} from '../../core/controllers';
import {SaleHelperService} from '../../core/helpers';
import {PaySaleModalComponent} from './pay-sale-modal.component';
import {SnackBarService} from '../../core/utilities';
import {PolicyService} from '../../core/policy';
import {of} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base-component';

@Component({
    templateUrl: './sale-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleDetailsComponent extends BaseComponent implements OnInit {

    sale: Sale;

    hidden: boolean;

    canDeletePayment: any;
    canPay: boolean;
    canDelete: boolean;

    expand = new Proxy({}, {
        get: (target, name) => name in target ? target[name] : false
    });
    displayedPaymentsColumns: String[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private helper: SaleHelperService,
                private service: SalesService,
                private dialog: MatDialog,
                private policy: PolicyService,
                private cdr: ChangeDetectorRef,
                private snackbar: SnackBarService) {
        super();
    }


    ngOnInit(): void {
        this.canDelete = this.policy.get('sale', 'canDelete');
        this.canPay = this.policy.get('sale', 'canPay');
        this.canDeletePayment = this.policy.get('payment', 'canDelete');
        const displayedPaymentsColumns = ['index', 'date', 'amount'];

        if (this.canDeletePayment) {
            displayedPaymentsColumns.push('actions');
        }

        this.displayedPaymentsColumns = displayedPaymentsColumns;

        this.route.params.subscribe(params => {
            this.getSale(+params['id']);
        });
    }

    getSale (id) {
        this.helper.findById(id).subscribe((res: Sale) => {
            this.sale = res;
            this.sale.salesLineItems.forEach(value => {
                value.price = value.trainingBundle.option.price;
                this.cdr.detectChanges();
            });
        });
    }

    delete() {
        const confirmed = confirm('Vuoi confermare l\'eliminazione della vendita per il cliente ' +
            this.sale.customer.firstName + ' ' + this.sale.customer.lastName + '?');
        if (confirmed) {
            this.helper.delete(this.sale.id)
                .subscribe(_ => {
                    this.snackbar.open('Vendita eliminata per il cliente ' + this.sale.customer.lastName + '!');
                    return this.router.navigateByUrl('/', {
                        replaceUrl: true,
                    });
                });
        }
    }

    pay() {
        const dialogRef = this.dialog.open(PaySaleModalComponent, { data: {
            sale: this.sale
            }});

        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(v => this.service.pay(v.sale.id, v.amount))
            )
        .subscribe(
            (value: Sale) => this.getSale(value.id)
        );
    }

    goToBundleSpecDetails(id: number) {
        this.router.navigate(['bundleSpecs', id], {
            relativeTo: this.route.parent
        });
    }

    goToBundleDetails(id: number) {
        this.router.navigate(['bundles', id], {
            relativeTo: this.route.parent
        });
    }

    closeAll() {
        for (const key in this.expand) {
            this.expand[key] = false;
        }
    }

    deletePayment(id: any) {
        of(confirm('Sei sicuro di voler eliminare il pagamento?'))
            .pipe(
                takeUntil(this.unsubscribe$),
                switchMap(v => this.service.deletePayment(this.sale.id, id))
            )
            .subscribe((data: Sale) => this.sale = data);
    }
}
