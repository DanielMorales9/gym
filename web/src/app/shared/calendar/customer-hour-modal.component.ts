import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseCalendarModal} from './base-calendar-modal';
import { theme } from '../config';

@Component({
    templateUrl: './customer-hour-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerHourModalComponent extends BaseCalendarModal implements OnInit {
    form: FormGroup;
    theme = theme;

    constructor(public dialogRef: MatDialogRef<CustomerHourModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            bundle: new FormControl({
                value: 0,
                disabled: this.isDisabled()
            }, Validators.required),
            date: new FormControl({
                disabled: !!this.modalData.event.date,
                value: this.modalData.event ? this.modalData.event.date : ''
            }, Validators.required),
            startTime: new FormControl({
                disabled: !!this.modalData.event.date,
                value: this.modalData.event.date ?  this.modalData.event.date.getHours() + ':' + this.modalData.event.date.getMinutes() : ''
            }, Validators.required),
        });
    }

    private isDisabled() {
        return this.modalData.event.bundles.length === 0;
    }

    get bundle() {
        return this.form.get('bundle');
    }

    get date() {
        return this.form.get('date');
    }

    get startTime() {
        return this.form.get('startTime');
    }

    get event() {
        return this.form.get('event');
    }

    submit() {
        if (!this.isDisabled()) {
            const startTime = this.startTime.value.split(':');

            const start = new Date(this.date.value);
            start.setHours(startTime[0]);
            start.setMinutes(startTime[1]);

            const end = new Date(start);
            end.setHours(start.getHours() + 1);

            const bundleId = this.bundle.value;
            const userId = this.modalData.userId;

            this.close({
                bundleId: bundleId,
                startTime: start,
                endTime: end,
                userId: userId,
                external: false,
            });
        }
        else {
            this.close();
        }
    }


}
