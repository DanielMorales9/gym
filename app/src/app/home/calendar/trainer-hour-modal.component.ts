import {Component, OnInit} from '@angular/core';
import {DateService, } from '../../services';
import {TimesOffService} from '../../shared/services';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'trainer-hour-modal',
    templateUrl: './trainer-hour-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerHourModalComponent extends BaseCalendarModal implements OnInit {

    timeOffName: string;

    constructor(private timesOffService: TimesOffService,
                public dialogRef: MatDialogRef<TrainerHourModalComponent>,
                private dateService: DateService) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        const startTime = new Date(this.modalData.event.date);
        const endTime = this.dateService.addHour(startTime);
        const startDate = this.dateService.getStringDate(startTime);
        this.timesOffService.book(startTime, endTime, 'trainer', this.timeOffName, this.modalData.userId)
            .subscribe((res) => {
                this.message = {
                    text: `Ferie confermate per il ${startDate}`,
                    class: 'alert-success'
                };
            }, (err) => {
                this.message = {
                    text: err.message,
                    class: 'alert-danger'
                };
            });
    }

}
