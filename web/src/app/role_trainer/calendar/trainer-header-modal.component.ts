import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BaseCalendarModal} from '../../shared/calendar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'trainer-header-modal',
    templateUrl: './trainer-header-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerHeaderModalComponent extends BaseCalendarModal implements OnInit {


    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<TrainerHeaderModalComponent>,
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
            start: new Date(this.modalData.event.day.date),
            userId: this.modalData.userId,
            name: this.name.value,
            type: 'trainer'
        });
    }

}
