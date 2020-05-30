import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { theme } from '../../shared';

@Component({
    selector: 'trainer-hour-modal',
    templateUrl: './trainer-hour-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerHourModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;
    theme = theme;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<TrainerHourModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = this.builder.group({
            name: ['', [Validators.required]],
            date: new FormControl({
                disabled: !!this.modalData.event.date,
                value: this.modalData.event ? this.modalData.event.date : ''
            }, Validators.required),
            startTime: new FormControl({
                disabled: !!this.modalData.event.date,
                value: this.modalData.event.date ?  this.modalData.event.date.getHours() + ':' + this.modalData.event.date.getMinutes() : ''
            }, Validators.required),
            endTime: new FormControl({
                disabled: !!this.modalData.event.date,
                value: this.modalData.event.date ?  this.modalData.event.date.getHours() + 1 + ':'
                    + this.modalData.event.date.getMinutes() : ''
            }, Validators.required)
        });
    }

    get name() {
        return this.form.get('name');
    }

    get date() {
        return this.form.get('date');
    }

    get startTime() {
        return this.form.get('startTime');
    }

    get endTime() {
        return this.form.get('endTime');
    }

    submit() {
        const startTime = this.startTime.value.split(':');
        const endTime = this.endTime.value.split(':');

        const start = new Date(this.date.value);
        const end = new Date(this.date.value);
        start.setHours(startTime[0]);
        start.setMinutes(startTime[1]);

        end.setHours(endTime[0]);
        end.setMinutes(endTime[1]);
        this.close({
            start: start,
            end: end,
            name: this.name.value,
            type: 'trainer',
            userId: this.modalData.userId
        });
    }

}
