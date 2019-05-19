import {Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../../shared/components/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'trainer-hour-modal',
    templateUrl: './trainer-hour-modal.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class TrainerHourModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

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
            name: ['', [Validators.required]]
        });
    }

    get name() {
        return this.form.get('name');
    }


    submit() {
        this.close({
            start: new Date(this.modalData.event.date),
            name: this.name.value,
            type: 'trainer',
            userId: this.modalData.userId
        });
    }

}
