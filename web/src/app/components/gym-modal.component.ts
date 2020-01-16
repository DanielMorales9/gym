import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from '@angular/material';
import {Gym} from '../shared/model';
import {rangeValidator} from '../core/functions';


@Component({
    templateUrl: './gym-modal.component.html',
    styleUrls: ['../styles/root.css']
})
export class GymModalComponent implements OnInit {

    gym: Gym;
    form: FormGroup;
    @ViewChild('days') output: MatSelectionList;

    constructor(public dialogRef: MatDialogRef<GymModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.gym = this.data;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    // get dayStartHour() {
    //     return this.form.get('dayStartHour');
    // }
    //
    // get dayEndHour() {
    //     return this.form.get('dayEndHour');
    // }

    get mondayStartHour() {
        return this.form.get('mondayStartHour');
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

    get tuesdayEndHour() {
        return this.form.get('tuesdayEndHour');
    }

    get tuesdayOpen() {
        return this.form.get('tuesdayOpen');
    }

    get wednesdayStartHour() {
        return this.form.get('wednesdayStartHour');
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

    get thursdayEndHour() {
        return this.form.get('thursdayEndHour');
    }

    get thursdayOpen() {
        return this.form.get('thursdayOpen');
    }

    get fridayStartHour() {
        return this.form.get('fridayStartHour');
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

    get saturdayEndHour() {
        return this.form.get('saturdayEndHour');
    }

    get saturdayOpen() {
        return this.form.get('saturdayOpen');
    }

    get sundayStartHour() {
        return this.form.get('sundayStartHour');
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

    buildForm() {
        const hourValidators = [Validators.required, Validators.min(0), Validators.max(24)];

        this.form = new FormGroup({
            name: new FormControl(this.gym.name, [Validators.required]),
            mondayOpen: new FormControl(this.gym.mondayOpen, [Validators.required]),
            reservationBeforeHours: new FormControl({
                value: this.gym.reservationBeforeHours
            }, hourValidators),
            mondayStartHour: new FormControl({
                disabled: !this.gym.mondayOpen,
                value: this.gym.mondayStartHour
            }, hourValidators),
            mondayEndHour: new FormControl({
                disabled: !this.gym.mondayOpen,
                value: this.gym.mondayEndHour
            }, hourValidators),
            tuesdayOpen: new FormControl(this.gym.tuesdayOpen, [Validators.required]),
            tuesdayStartHour: new FormControl({
                disabled: !this.gym.tuesdayOpen,
                value: this.gym.tuesdayStartHour
            }, hourValidators),
            tuesdayEndHour: new FormControl({
                disabled: !this.gym.tuesdayOpen,
                value: this.gym.tuesdayEndHour
            }, hourValidators),
            wednesdayOpen: new FormControl(this.gym.wednesdayOpen, [Validators.required]),
            wednesdayStartHour: new FormControl({
                disabled: !this.gym.wednesdayOpen,
                value: this.gym.wednesdayStartHour
            }, hourValidators),
            wednesdayEndHour: new FormControl({
                disabled: !this.gym.wednesdayOpen,
                value: this.gym.wednesdayEndHour
            }, hourValidators),
            thursdayOpen: new FormControl(this.gym.thursdayOpen, [Validators.required]),
            thursdayStartHour: new FormControl({
                disabled: !this.gym.thursdayOpen,
                value: this.gym.thursdayStartHour
            }, hourValidators),
            thursdayEndHour: new FormControl({
                disabled: !this.gym.thursdayOpen,
                value: this.gym.thursdayEndHour
            }, hourValidators),
            fridayOpen: new FormControl(this.gym.fridayOpen, [Validators.required]),
            fridayStartHour: new FormControl({
                disabled: !this.gym.fridayOpen,
                value: this.gym.fridayStartHour
            }, hourValidators),
            fridayEndHour: new FormControl({
                disabled: !this.gym.fridayOpen,
                value: this.gym.fridayEndHour
            }, hourValidators),
            saturdayOpen: new FormControl(this.gym.saturdayOpen, [Validators.required]),
            saturdayStartHour: new FormControl({
                disabled: !this.gym.saturdayOpen,
                value: this.gym.saturdayStartHour
            }, hourValidators),
            saturdayEndHour: new FormControl({
                disabled: !this.gym.saturdayOpen,
                value: this.gym.saturdayEndHour
            }, hourValidators),
            sundayOpen: new FormControl(this.gym.sundayOpen, [Validators.required]),
            sundayStartHour: new FormControl({
                disabled: !this.gym.sundayOpen,
                value: this.gym.sundayStartHour
            }, hourValidators),
            sundayEndHour: new FormControl({
                disabled: !this.gym.sundayOpen,
                value: this.gym.sundayEndHour
            }, hourValidators),
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
            }
            else {
                this.mondayStartHour.disable();
                this.mondayEndHour.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.tuesdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.tuesdayStartHour.enable();
                this.tuesdayEndHour.enable();
            }
            else {
                this.tuesdayStartHour.disable();
                this.tuesdayEndHour.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.wednesdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.wednesdayStartHour.enable();
                this.wednesdayEndHour.enable();
            }
            else {
                this.wednesdayStartHour.disable();
                this.wednesdayEndHour.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.thursdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.thursdayStartHour.enable();
                this.thursdayEndHour.enable();
            }
            else {
                this.thursdayStartHour.disable();
                this.thursdayEndHour.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.fridayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.fridayStartHour.enable();
                this.fridayEndHour.enable();
            }
            else {
                this.fridayStartHour.disable();
                this.fridayEndHour.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.saturdayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.saturdayStartHour.enable();
                this.saturdayEndHour.enable();
            }
            else {
                this.saturdayStartHour.disable();
                this.saturdayEndHour.disable();
            }
            this.form.updateValueAndValidity();
        });

        this.sundayOpen.valueChanges.subscribe(checked => {
            if (checked) {
                this.sundayStartHour.enable();
                this.sundayEndHour.enable();
            }
            else {
                this.sundayStartHour.disable();
                this.sundayEndHour.disable();
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
