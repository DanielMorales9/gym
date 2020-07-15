import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Sale} from '../model';
import {PaySaleModalComponent} from './pay-sale-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'sale-item',
    templateUrl: './sale-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleItemComponent {

    @Input() sale: Sale;
    @Input() canPay: boolean;
    @Input() canDelete: boolean;
    @Output() done = new EventEmitter();

    constructor(private dialog: MatDialog) {
    }

    deleteSale() {
        this.done.emit({type: 'delete', sale: this.sale});
    }

    pay() {
        const dialogRef = this.dialog.open(PaySaleModalComponent, { data: {
                sale: this.sale
            }});

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                res['type'] = 'pay';
                this.done.emit(res);
            }
        });
    }

    goToUserDetails() {
        this.done.emit({type: 'userInfo', user: this.sale.customer});
    }

    goToInfo() {
        this.done.emit({type: 'info', sale: this.sale});
    }
}
