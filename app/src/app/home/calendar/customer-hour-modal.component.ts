import {Component, OnInit} from '@angular/core';
import {DateService} from '../../services';
import {TrainingService} from '../../shared/services';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'customer-hour-modal',
    templateUrl: './customer-hour-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerHourModalComponent extends BaseCalendarModal implements OnInit {


    constructor(private dateService: DateService,
                private trainingService: TrainingService,
                public dialogRef: MatDialogRef<CustomerHourModalComponent>) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        const currentDate = new Date(this.modalData.event.date);
        const stringDate = this.dateService.getStringDate(currentDate);
        this.trainingService.book(currentDate, this.modalData.userId)
            .subscribe( (_) => {
                this.message = {
                    text: `Prenotazione effettuata per il ${stringDate}`,
                    class: 'alert-success'
                };
            }, (err) => {
                this.message = {
                    text: err.error.message,
                    class: 'alert-danger'
                };
            });
    }

}
