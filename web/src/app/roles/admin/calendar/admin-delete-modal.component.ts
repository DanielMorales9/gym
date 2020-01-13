import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './admin-delete-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class AdminDeleteModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<AdminDeleteModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(dialogRef);
        this.modalData = data;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = this.builder.group({
            name: ['', [Validators.required]]
        });
    }

    submit() {
        const data = {
            type: this.modalData.event.meta.type,
            eventId: this.modalData.event.meta.id
        };
        this.close(data);
    }
}
