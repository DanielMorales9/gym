import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Workout} from '../model';

@Component({
    templateUrl: './workout-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutModalComponent implements OnInit {

    workout: any;
    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<WorkoutModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.workout = this.data.workout;
    }

    ngOnInit(): void {
        const hasWorkout = !!this.workout;
        if (!hasWorkout) {
            this.workout = new Workout();
        }

        this.buildForm(hasWorkout);
    }

    private buildForm(hasBundle: boolean) {
        this.form = new FormGroup({
            name: new FormControl(this.workout.name, Validators.required),
            description: new FormControl(this.workout.description, Validators.required),
            tag1: new FormControl(this.workout.tag1, Validators.required),
            tag2: new FormControl(this.workout.tag2),
            tag3: new FormControl(this.workout.tag3)
        });
    }

    get name() {
        return this.form.get('name');
    }

    get description() {
        return this.form.get('description');
    }

    get tag1() {
        return this.form.get('tag1');
    }

    get tag2() {
        return this.form.get('tag2');
    }

    get tag3() {
        return this.form.get('tag3');
    }

    submit() {
        const workout = this.getWorkoutFromForm();
        this.dialogRef.close(workout);
    }

    private getWorkoutFromForm(): Workout {
        const workout = new Workout();

        workout.id = this.workout.id;
        workout.name = this.name.value;
        workout.description = this.description.value;
        workout.template = (this.workout.template == null) || this.workout.template;
        workout.tag1 = this.tag1.value;
        workout.tag2 = this.tag2.value;
        workout.tag3 = this.tag3.value;

        return workout;
    }
}
