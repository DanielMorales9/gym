import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseCalendarModal} from '../../shared/calendar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './trainer-change-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerChangeModalComponent extends BaseCalendarModal implements OnInit {

    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<TrainerChangeModalComponent>,
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
        this.close({
            start: this.modalData.event.newStart,
            end: this.modalData.event.newEnd,
            eventId: this.modalData.event.event.meta.id,
            eventName: this.name.value,
            type: 'trainer'
        });

    }

}
