import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {theme} from '../../shared';

@Component({
    templateUrl: './admin-hour-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHourModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    template: any;
    hasCourses: boolean;
    theme = theme;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<AdminHourModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.buildForm();

        this.template = {};
        this.template['chiusura'] = {
            title: 'Nome chiusura',
            message: 'Conferma per chiudere la palestra.'
        };
        this.template['corso'] = {
            title: 'Nome evento corso',
            message: 'Conferma per creare l\'evento.'
        };

    }

    private buildForm() {
        this.form = this.builder.group({
            name: ['', [Validators.required]],
            event: ['', [Validators.required]],
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
            }, Validators.required),
            course: new FormControl({
                disabled: true,
                value: ''}, Validators.required)
        });

        this.event.valueChanges.subscribe(value => {
            if (value === 'corso') {
                this.hasCourses = this.modalData.event.courses.length > 0;
                if (!this.hasCourses) {
                    this.course.disable();
                }
                else {
                    this.course.enable();
                }
            }
            else {
                this.course.disable();
            }
            this.form.updateValueAndValidity();
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

    get event() {
        return this.form.get('event');
    }

    get course() {
        return this.form.get('course');
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
        if (this.event.value === 'corso' && this.hasCourses) {
            this.close({
                start: start,
                end: end,
                eventName: this.name.value,
                type: 'course',
                userId: this.modalData.userId,
                meta: this.course.value
            });
        } else if (this.event.value === 'chiusura') {
            this.close({
                start: start,
                end: end,
                eventName: this.name.value,
                type: 'admin',
                userId: this.modalData.userId
            });
        } else {
            this.close();
        }
    }


}
