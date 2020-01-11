import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Sale} from '../../shared/model';
import {SalesService} from '../../core/controllers';

@Component({
    templateUrl: './bundle-select-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class BundleSelectModalComponent {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna edizione disponibile';
    form: FormGroup;

    title: string;
    selected: Map<number, boolean>;
    bundles: any;
    spec: any;
    private sale: Sale;

    constructor(private builder: FormBuilder,
                private service: SalesService,
                public dialogRef: MatDialogRef<BundleSelectModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.spec = this.data.spec;
        this.sale = this.data.sale;
        this.title = this.data.title;
        this.bundles = this.data.bundles;

        const selected = this.data.selected;
        this.selected = new Map();
        this.bundles.forEach(v => {
            this.selected[v.id] = selected[v.id];
        });

    }

    getSelectBundle(id: number) {
        let isSelected;
        if (id) {
            if (!this.selected[id]) {
                this.selected[id] = false;
            }
            isSelected = this.selected[id];
        }
        return isSelected;
    }

    selectBundle(bundle: any) {
        const isSelected = !this.getSelectBundle(bundle.id);
        this.selected[bundle.id] = isSelected;

        if (isSelected) {
            this.addSalesLineItemByBundle(bundle.id);
        } else {
            this.deleteSalesLineItem(bundle.id);
        }
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close(this.selected);
    }


    private deleteSalesLineItem(id: any) {
        const salesLineId = this.sale
            .salesLineItems
            .map(line => [line.id, line.bundleSpecification.id])
            .filter(line => line[1] === id)
            .map(line => line[0])[0];

        this.service.deleteSalesLineItem(this.sale.id, id).subscribe( (s: Sale) => this.sale = s );
    }

    private addSalesLineItemByBundle(id: any) {
        this.service.addSalesLineItemByBundle(this.sale.id, id).subscribe( (s: Sale) => this.sale = s );
    }
}
