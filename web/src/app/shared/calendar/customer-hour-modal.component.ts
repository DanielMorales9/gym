import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseCalendarModal} from './base-calendar-modal';
import { theme } from '../config';
import {PolicyService} from '../../core/policy';

@Component({
    templateUrl: './customer-hour-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerHourModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;
    theme = theme;
    canBookExternal: boolean;

    constructor(public dialogRef: MatDialogRef<CustomerHourModalComponent>,
                private policy: PolicyService,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.canBookExternal = this.policy.get('bundleSpec', 'canBookExternal');

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
            external: new FormControl({
                disabled: !this.canBookExternal,
                value: !!this.modalData.event.external
            }, Validators.required),
        });
        this.cdr.detectChanges();
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

    get external() {
        return this.form.get('external');
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
                external: this.external.value,
            });
        }
        else {
            this.close();
        }
    }


}
