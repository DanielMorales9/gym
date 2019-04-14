import {Component, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'customer-info-modal',
    templateUrl: './customer-info-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerInfoModalComponent extends BaseCalendarModal implements OnInit {

    constructor(public dialogRef: MatDialogRef<CustomerInfoModalComponent>) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        return false;
    }

}
