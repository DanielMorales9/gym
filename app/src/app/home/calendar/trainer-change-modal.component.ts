import {Component, OnInit} from '@angular/core';
import {DateService} from '../../services';
import {MatDialogRef} from '@angular/material';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {TimesOffService} from '../../shared/services';

@Component({
    selector: 'trainer-change-modal',
    templateUrl: './trainer-change-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerChangeModalComponent extends BaseCalendarModal implements OnInit {

    constructor(public dialogRef: MatDialogRef<TrainerChangeModalComponent>,
                private timesOffService: TimesOffService,
                private dateService: DateService) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        const startTime = this.modalData.event.newStart;
        const endTime = this.modalData.event.newEnd;
        const timeOffId = this.modalData.event.event.meta.id;
        const startDate = this.dateService.getStringDate(startTime);
        this.timesOffService.change(timeOffId, startTime, endTime, this.modalData.event.event.meta.name, 'trainer')
            .subscribe((_) => {
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
