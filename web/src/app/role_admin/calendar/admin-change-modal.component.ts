import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './admin-change-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class AdminChangeModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<AdminChangeModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = this.builder.group({
            name: [this.modalData.event.event.meta.name, [Validators.required]]
        });
    }

    get name() {
        return this.form.get('name');
    }

    submit() {
        const startTime = this.modalData.event.newStart;
        const endTime = this.modalData.event.newEnd;
        this.close({
            eventId: this.modalData.event.event.meta.id,
            start: startTime,
            end: endTime,
            eventName: this.name.value,
        });
    }

}
