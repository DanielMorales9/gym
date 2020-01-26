import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './admin-header-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class AdminHeaderModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<AdminHeaderModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = this.data;
        console.log(this.modalData);
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = this.builder.group({
            name: ['', [Validators.required]]
        });
    }

    get name() {
        return this.form.get('name');
    }


    submit() {
        this.dialogRef.close({
            start: new Date(this.modalData.event.day.date),
            eventName: this.name.value,
            userId: this.modalData.userId,
            type: 'admin'
        });
    }

}
