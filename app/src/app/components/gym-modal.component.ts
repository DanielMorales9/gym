import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from '@angular/material';
import {Gym} from '../shared/model';


@Component({
    templateUrl: './gym-modal.component.html',
    styleUrls: ['../styles/root.css']
})
export class GymModalComponent implements OnInit {

    gym: Gym;
    form: FormGroup;
    dayOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    @ViewChild('days') output: MatSelectionList;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<GymModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.gym = this.data;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    get dayStartHour() {
        return this.form.get('dayStartHour');
    }

    get dayEndHour() {
        return this.form.get('dayEndHour');
    }

    get name() {
        return this.form.get('name');
    }

    buildForm() {
        const config = {};
        config['name'] = [this.gym.name, [Validators.required]];
        config['dayStartHour'] = [this.gym.dayStartHour, [Validators.required]];
        config['dayEndHour'] = [this.gym.dayEndHour, [Validators.required]];
        this.form = this.builder.group(config);
    }

    submit() {
        this.gym.excludeDays = this.output.selectedOptions.selected.map(v => v.value);
        this.gym.dayEndHour = this.dayEndHour.value;
        this.gym.dayStartHour = this.dayStartHour.value;
        console.log(this.gym);

        this.dialogRef.close(this.gym);
    }

    isSelected(i: number) {
        return this.gym.excludeDays.indexOf(i) > -1;
    }
}
