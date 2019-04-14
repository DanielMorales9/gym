import {Component, OnInit} from '@angular/core';
import {GymConfigurationService, NotificationService} from '../../services';
import {TimesOffService} from '../../shared/services';
import {BaseCalendarModal} from '../../shared/components/calendar';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'trainer-header-modal',
    templateUrl: './trainer-header-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainerHeaderModalComponent extends BaseCalendarModal implements OnInit {


    timeOffName: string;

    constructor(private timesOffService: TimesOffService,
                public dialogRef: MatDialogRef<TrainerHeaderModalComponent>,
                private gymConf: GymConfigurationService) {
        super(dialogRef);
    }

    ngOnInit(): void {
    }

    submit() {
        const {startTime, endTime} = this.gymConf.getStartAndEndTimeByGymConfiguration(new Date(this.modalData.event.day.date));
        const stringDate = (startTime);
        this.timesOffService.book(startTime, endTime, 'trainer', this.timeOffName, this.modalData.userId)
            .subscribe((res) => {
                this.message = {
                    text: `Ferie confermate per il ${stringDate}`,
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
