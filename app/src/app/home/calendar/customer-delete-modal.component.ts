import {Component, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {TrainingService} from '../../shared/services';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'customer-delete-modal',
    templateUrl: './customer-delete-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerDeleteModalComponent extends BaseCalendarModal implements OnInit {


    constructor(private trainingService: TrainingService,
                public dialogRef: MatDialogRef<CustomerDeleteModalComponent>) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        if (this.modalData.event.meta.type === 'reservation') {
            this.trainingService.delete(this.modalData.event.meta.id)
                .subscribe(res => {
                    const that = this;
                    setTimeout(function() {
                    }, 1000);
                    this.message = {
                        text: 'La Prenotazione è stata eliminata!',
                        class: 'alert-warning'
                    };
                }, err => {
                    this.message = {
                        text: err.error.message,
                        class: 'alert-danger'
                    };
                });

        } else {
            this.message = {
                text: 'Questa azione non è consentita!',
                class: 'alert-danger'
            };
        }
    }

}
