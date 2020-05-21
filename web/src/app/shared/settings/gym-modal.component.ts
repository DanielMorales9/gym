import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from '@angular/material';
import {Gym} from '../model';
import {rangeValidator} from '../../core/functions';


@Component({
    templateUrl: './gym-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class GymModalComponent implements OnInit {

    gym: Gym;
    form: FormGroup;
    @ViewChild('days', { static: false }) output: MatSelectionList;

    constructor(public dialogRef: MatDialogRef<GymModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.gym = this.data;
        console.log(this.gym);
        this.buildForm();
    }

    get mondayStartHour() {
        return this.form.get('mondayStartHour');
    }

    get mondayNumEvents() {
        return this.form.get('mondayNumEvents');
    }

    get mondayEndHour() {
        return this.form.get('mondayEndHour');
    }

    get mondayOpen() {
        return this.form.get('mondayOpen');
    }

    get tuesdayStartHour() {
        return this.form.get('tuesdayStartHour');
    }

    get tuesdayNumEvents() {
        return this.form.get('tuesdayNumEvents');
    }

    get tuesdayEndHour() {
        return this.form.get('tuesdayEndHour');
    }

    get tuesdayOpen() {
        return this.form.get('tuesdayOpen');
    }

    get wednesdayStartHour() {
        return this.form.get('wednesdayStartHour');
    }

    get wednesdayNumEvents() {
        return this.form.get('wednesdayNumEvents');
    }

    get wednesdayEndHour() {
        return this.form.get('wednesdayEndHour');
    }

    get wednesdayOpen() {
        return this.form.get('wednesdayOpen');
    }

    get thursdayStartHour() {
        return this.form.get('thursdayStartHour');
    }

    get thursdayNumEvents() {
        return this.form.get('thursdayNumEvents');
    }

    get thursdayEndHour() {
        return this.form.get('thursdayEndHour');
    }

    get thursdayOpen() {
        return this.form.get('thursdayOpen');
    }

    get fridayStartHour() {
        return this.form.get('fridayStartHour');
    }

    get fridayNumEvents() {
        return this.form.get('fridayNumEvents');
    }

    get fridayEndHour() {
        return this.form.get('fridayEndHour');
    }

    get fridayOpen() {
        return this.form.get('fridayOpen');
    }

    get saturdayStartHour() {
        return this.form.get('saturdayStartHour');
    }

    get saturdayNumEvents() {
        return this.form.get('saturdayNumEvents');
    }

    get saturdayEndHour() {
        return this.form.get('saturdayEndHour');
    }

    get saturdayOpen() {
        return this.form.get('saturdayOpen');
    }

    get sundayStartHour() {
        return this.form.get('sundayStartHour');
    }

    get sundayNumEvents() {
        return this.form.get('sundayNumEvents');
    }

    get sundayEndHour() {
        return this.form.get('sundayEndHour');
    }

    get sundayOpen() {
        return this.form.get('sundayOpen');
    }

    get name() {
        return this.form.get('name');
    }

    get reservationBeforeHours() {
        return this.form.get('reservationBeforeHours');
    }

    get minutesBetweenEvents() {
        return this.form.get('minutesBetweenEvents');
    }

    get numEvents() {
        return this.form.get('numEvents');
    }

    buildForm() {
        const hourValidators = [Validators.required, Validators.min(0), Validators.max(24)];
        const validatorOrOpts = [Validators.required, Validators.min(0)];

        this.form = new FormGroup({
            name: new FormControl(this.gym.name, [Validators.required]),
            mondayOpen: new FormControl(this.gym.mondayOpen, [Validators.required]),
            reservationBeforeHours: new FormControl({
                value: this.gym.reservationBeforeHours as number
            }, validatorOrOpts),
            mondayStartHour: new FormControl({
                disabled: !this.gym.mondayOpen,
                value: this.gym.mondayStartHour
            }, hourValidators),
            mondayEndHour: new FormControl({
                disabled: !this.gym.mondayOpen,
                value: this.gym.mondayEndHour
            }, hourValidators),
            mondayNumEvents: new FormControl({
                disabled: !this.gym.mondayOpen,
                value: this.gym.mondayNumEvents
            }, validatorOrOpts),
            tuesdayOpen: new FormControl(this.gym.tuesdayOpen, [Validators.required]),
            tuesdayStartHour: new FormControl({
                disabled: !this.gym.tuesdayOpen,
                value: this.gym.tuesdayStartHour
            }, hourValidators),
            tuesdayEndHour: new FormControl({
                disabled: !this.gym.tuesdayOpen,
                value: this.gym.tuesdayEndHour
            }, hourValidators),
            tuesdayNumEvents: new FormControl({
                disabled: !this.gym.tuesdayOpen,
                value: this.gym.tuesdayNumEvents
            }, validatorOrOpts),
            wednesdayOpen: new FormControl(this.gym.wednesdayOpen, [Validators.required]),
            wednesdayStartHour: new FormControl({
                disabled: !this.gym.wednesdayOpen,
                value: this.gym.wednesdayStartHour
            }, hourValidators),
            wednesdayEndHour: new FormControl({
                disabled: !this.gym.wednesdayOpen,
                value: this.gym.wednesdayEndHour
            }, hourValidators),
            wednesdayNumEvents: new FormControl({
                disabled: !this.gym.wednesdayOpen,
                value: this.gym.wednesdayNumEvents
            }, validatorOrOpts),
            thursdayOpen: new FormControl(this.gym.thursdayOpen, [Validators.required]),
            thursdayStartHour: new FormControl({
                disabled: !this.gym.thursdayOpen,
                value: this.gym.thursdayStartHour
            }, hourValidators),
            thursdayEndHour: new FormControl({
                disabled: !this.gym.thursdayOpen,
                value: this.gym.thursdayEndHour
            }, hourValidators),
            thursdayNumEvents: new FormControl({
                disabled: !this.gym.thursdayOpen,
                value: this.gym.thursdayNumEvents
            }, validatorOrOpts),
            fridayOpen: new FormControl(this.gym.fridayOpen, [Validators.required]),
            fridayStartHour: new FormControl({
                disabled: !this.gym.fridayOpen,
                value: this.gym.fridayStartHour
            }, hourValidators),
            fridayEndHour: new FormControl({
                disabled: !this.gym.fridayOpen,
                value: this.gym.fridayEndHour
            }, hourValidators),
            fridayNumEvents: new FormControl({
                disabled: !this.gym.fridayOpen,
                value: this.gym.fridayNumEvents
            }, validatorOrOpts),
            saturdayOpen: new FormControl(this.gym.saturdayOpen, [Validators.required]),
            saturdayStartHour: new FormControl({
                disabled: !this.gym.saturdayOpen,
                value: this.gym.saturdayStartHour
            }, hourValidators),
            saturdayEndHour: new FormControl({
                disabled: !this.gym.saturdayOpen,
                value: this.gym.saturdayEndHour
            }, hourValidators),
            saturdayNumEvents: new FormControl({
                disabled: !this.gym.saturdayOpen,
                value: this.gym.saturdayNumEvents
            }, validatorOrOpts),
            sundayOpen: new FormControl(this.gym.sundayOpen, [Validators.required]),
            sundayStartHour: new FormControl({
                disabled: !this.gym.sundayOpen,
                value: this.gym.sundayStartHour
            }, hourValidators),
            sundayEndHour: new FormControl({
                disabled: !this.gym.sundayOpen,
                value: this.gym.sundayEndHour
            }, hourValidators),
            sundayNumEvents: new FormControl({
                disabled: !this.gym.sundayOpen,
                value: this.gym.sundayNumEvents
            }, validatorOrOpts),
            numEvents: new FormControl({
                value: this.gym.numEvents as number
            }, validatorOrOpts),
            minutesBetweenEvents: new FormControl({
                value: this.gym.minutesBetweenEvents as number
            }, validatorOrOpts),
        }, [
            rangeValidator('mondayStartHour', 'mondayEndHour').bind(this),
            rangeValidator('tuesdayStartHour', 'tuesdayEndHour').bind(this),
            rangeValidator('wednesdayStartHour', 'wednesdayEndHour').bind(this),
            rangeValidator('thursdayStartHour', 'thursdayEndHour').bind(this),
            rangeValidator('fridayStartHour', 'fridayEndHour').bind(this),
            rangeValidator('saturdayStartHour', 'saturdayEndHour').bind(this),
            rangeValidator('sundayStartHour', 'sundayEndHour').bind(this),
        ]);

        this.mondayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.mondayStartHour.enable();
                this.mondayEndHour.enable();
                this.mondayNumEvents.enable();
            }
            else {
                this.mondayStartHour.disable();
                this.mondayEndHour.disable();
                this.mondayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.tuesdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.tuesdayStartHour.enable();
                this.tuesdayEndHour.enable();
                this.tuesdayNumEvents.enable();
            }
            else {
                this.tuesdayStartHour.disable();
                this.tuesdayEndHour.disable();
                this.tuesdayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.wednesdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.wednesdayStartHour.enable();
                this.wednesdayEndHour.enable();
                this.wednesdayNumEvents.enable();
            }
            else {
                this.wednesdayStartHour.disable();
                this.wednesdayEndHour.disable();
                this.wednesdayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.thursdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.thursdayStartHour.enable();
                this.thursdayEndHour.enable();
                this.thursdayNumEvents.enable();
            }
            else {
                this.thursdayStartHour.disable();
                this.thursdayEndHour.disable();
                this.thursdayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.fridayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.fridayStartHour.enable();
                this.fridayEndHour.enable();
                this.fridayNumEvents.enable();
            }
            else {
                this.fridayStartHour.disable();
                this.fridayEndHour.disable();
                this.fridayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.saturdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.saturdayStartHour.enable();
                this.saturdayEndHour.enable();
                this.saturdayNumEvents.enable();
            }
            else {
                this.saturdayStartHour.disable();
                this.saturdayEndHour.disable();
                this.saturdayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.sundayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.sundayStartHour.enable();
                this.sundayEndHour.enable();
                this.sundayNumEvents.enable();
            }
            else {
                this.sundayStartHour.disable();
                this.sundayEndHour.disable();
                this.sundayNumEvents.disable();
            }
            this.form.updateValueAndValidity();
        });
    }

    submit() {
        // tslint:disable-next-line:forin
        for (const key in this.form.controls) {
            this.gym[key] = this.form.controls[key].value;
        }

        this.dialogRef.close(this.gym);
    }

}
