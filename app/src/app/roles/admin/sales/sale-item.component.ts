import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Sale} from '../../../shared/model';
import {DateService} from '../../../services';
import {PaySaleModalComponent} from './pay-sale-modal.component';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'sale-item',
    templateUrl: './sale-item.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css'],
})
export class SaleItemComponent {

    @Input() sale: Sale;
    @Output() done = new EventEmitter();

    constructor(private dateService: DateService,
                private dialog: MatDialog) {
    }

    deleteSale() {
        this.done.emit({type: 'delete', sale: this.sale});
    }

    getDate(createdAt: string) {
        return this.dateService.getStringDate(createdAt);
    }

    pay() {
        const dialogRef = this.dialog.open(PaySaleModalComponent, { data: {
                sale: this.sale
            }});

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                res['type'] = 'pay';
                this.done.emit(res)
            }
        })
    }
}
