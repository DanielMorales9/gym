import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseBundle, PersonalBundleSpecification, Sale} from '../model';
import {MatDialog} from '@angular/material';
import {SalesService} from '../../core/controllers';
import {SaleHelperService} from '../../core/helpers';
import {PaySaleModalComponent} from './pay-sale-modal.component';
import {SnackBarService} from '../../core/utilities';
import {PolicyService} from '../../core/policy';

@Component({
    templateUrl: './sale-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
})
export class SaleDetailsComponent implements OnInit {

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
                private snackbar: SnackBarService) {
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
                if (value.trainingBundle.type === 'P') {
                    value.price = (value.bundleSpecification as PersonalBundleSpecification).price;
                } else {
                    value.price = (value.trainingBundle as CourseBundle).option.price;
                }
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

        dialogRef.afterClosed().subscribe(res => {
            if (res) { this.service.pay(res.sale.id, res.amount).subscribe((value: Sale) => this.getSale(value.id));
            }
        });
    }

    async goToBundleSpecDetails(id: number) {
        await this.router.navigate(['bundleSpecs', id], {
            relativeTo: this.route.parent
        });
    }

    async goToBundleDetails(id: number) {
        await this.router.navigate(['bundles', id], {
            relativeTo: this.route.parent
        });
    }

    closeAll() {
        for (const key in this.expand) {
            this.expand[key] = false;
        }
    }

    async deletePayment(id: any) {
        const res = confirm('Sei sicuro di voler eliminare il pagamento?');
        if (res) {
            const [data, error] = await this.service.deletePayment(this.sale.id, id);
            if (error) {
                throw error;
            }
            this.sale = data;
        }
    }
}
