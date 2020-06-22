import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
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
                private cdr: ChangeDetectorRef,
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
            external: new FormControl({
                disabled: !!this.modalData.event.external,
                value: !!this.modalData.event.external
            }),
            maxCustomers: new FormControl({
                disabled: false
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
                    this.external.enable();
                    this.maxCustomers.enable();
                }
            }
            else {
                this.course.disable();
                this.external.disable();
                this.maxCustomers.disable();

            }
            this.form.updateValueAndValidity();
        });

        this.course.valueChanges.subscribe( v => {
            this.maxCustomers.setValue(v.maxCustomers);
            this.cdr.detectChanges();
            this.form.updateValueAndValidity();
        });

    }

    get name() {
        return this.form.get('name');
    }

    get external() {
        return this.form.get('external');
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

    get maxCustomers() {
        return this.form.get('maxCustomers');
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
                meta: this.course.value.id,
                external: !!this.external.value,
                maxCustomers: this.maxCustomers.value
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
