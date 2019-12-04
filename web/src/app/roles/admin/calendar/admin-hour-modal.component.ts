import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './admin-hour-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class AdminHourModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    template: any;
    hasCourses: boolean;

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
            message: 'Conferma per chiudere la palestra oppure cancella.'
        };
        this.template['corso'] = {
            title: 'Nome evento corso',
            message: 'Conferma per creare l\'evento opppure cancella.'
        };

    }

    private buildForm() {
        this.form = this.builder.group({
            name: ['', [Validators.required]],
            event: ['', [Validators.required]],
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

    get event() {
        return this.form.get('event');
    }

    get course() {
        return this.form.get('course');
    }

    submit() {
        if (this.event.value === 'corso' && this.hasCourses) {
            this.close({
                start: new Date(this.modalData.event.date),
                eventName: this.name.value,
                type: 'course',
                userId: this.modalData.userId,
                meta: this.course.value
            });
        } else if (this.event.value === 'chiusura') {
            this.close({
                start: new Date(this.modalData.event.date),
                eventName: this.name.value,
                type: 'admin',
                userId: this.modalData.userId
            });
        } else {
            this.close();
        }
    }


}
