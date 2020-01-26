import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CourseBundle, CourseBundleSpecification, Sale} from '../../shared/model';
import {SalesService} from '../../core/controllers';

@Component({
    templateUrl: './option-select-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class OptionSelectModalComponent {

    SIMPLE_NO_CARD_MESSAGE = 'Nessuna Opzione disponibile';
    form: FormGroup;

    title: string;
    selected: Map<number, boolean>;
    spec: CourseBundleSpecification;
    sale: Sale;
    backupSelected: Map<number, boolean>;

    constructor(private builder: FormBuilder,
                private service: SalesService,
                public dialogRef: MatDialogRef<OptionSelectModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        dialogRef.disableClose = true;
        this.spec = this.data.spec;
        this.sale = this.data.sale;
        this.title = this.data.title;

        const selected = this.data.selected;
        this.backupSelected = this.data.selected;
        this.selected = new Map();
        this.spec.options.forEach(v => {
            this.selected[v.id] = selected[v.id];
        });

        this.dialogRef.backdropClick().subscribe(async value => {
            await this.close();
        });
    }

    getSelectOption(id: number) {
        let isSelected;
        if (id) {
            if (!this.selected[id]) {
                this.selected[id] = false;
            }
            isSelected = this.selected[id];
        }
        return isSelected;
    }

    selectOption(option: any) {
        console.log(option);
        const isSelected = !this.getSelectOption(option.id);
        this.selected[option.id] = isSelected;
        const id = option.id;

        this.addOrDelete(isSelected, id);
    }

    private async addOrDelete(isSelected: boolean, id) {
        if (isSelected) {
            await this.addSalesLineItem(id);
        } else {
            await this.deleteSalesLineItem(id);
        }
    }

    async close() {
        // tslint:disable-next-line:prefer-const
        for (let k in this.selected) {
            const key = +k;
            if (!!this.backupSelected[key]) {
                if (this.backupSelected[key] !== this.selected[key]) {
                    console.log(this.backupSelected[key], key);
                    await this.addOrDelete(this.backupSelected[key], key);
                }
            } else {
                console.log(false, key);
                await this.addOrDelete(false, key);
            }
        }
        this.dialogRef.close({selected: this.backupSelected, sale: this.sale});
    }

    submit() {
        this.dialogRef.close({selected: this.selected, sale: this.sale});
    }

    private async deleteSalesLineItem(id: any) {
        const salesLineId = this.sale
            .salesLineItems
            .map(line => [line.id, (line.trainingBundle as CourseBundle).option.id])
            .filter(line => line[1] === id)
            .map(line => line[0])[0];


        const [data, error] = await this.service.deleteSalesLineItem(this.sale.id, salesLineId);
        if (error) {
            throw error;
        }
        this.sale = data;
    }

    private async addSalesLineItem(id: any) {
        const [data, error] = await this.service.addSalesLineItem({
            saleId: this.sale.id,
            bundleSpecId: this.spec.id,
            optionId: id
        });
        if (error) {
            throw error;
        }
        this.sale = data;
    }
}
