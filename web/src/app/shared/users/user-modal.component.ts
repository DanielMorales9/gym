import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {User} from '../model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
    selector: 'user-patch-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent implements OnInit {


    title: string;
    method: string;

    canShowRole = false;
    canShowGender = true;
    canShowHeightAndWeight = false;

    user: User;
    form: FormGroup;

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<UserModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.user = this.data.user;
        this.title = this.data.title;
        this.method = this.data.method;
    }

    ngOnInit(): void {
        if (!this.user) {
            this.user = new User();
        }

        this.buildForm();
    }

    buildForm() {
        this.canShowHeightAndWeight = this.user.type === 'C' && this.method === 'patch';
        this.canShowRole = this.method === 'post';

        const config = {};
        config['firstName'] = [this.user.firstName, [Validators.required]];
        config['lastName'] = [this.user.lastName, [Validators.required]];
        config['email'] = [this.user.email, [Validators.required, Validators.email]];
        config['phone'] = [this.user.phoneNumber, [Validators.pattern(/\d{10}/)]];

        if (this.canShowHeightAndWeight) {
            config['height'] = [this.user.height, [
                Validators.max(300),
                Validators.min(100)]];
            config['weight'] = [this.user.weight, [
                Validators.max(1000),
                Validators.min(20)]];
        }

        if (this.canShowRole) {
            config['type'] = [this.user.type, [Validators.required]];
        }

        if (this.canShowGender) {
            config['gender'] = [this.user.gender, [Validators.required]];
        }

        this.form = this.builder.group(config);
    }

    get firstName() {
        return this.form.get('firstName');
    }

    get lastName() {
        return this.form.get('lastName');
    }

    get height() {
        return this.form.get('height');
    }

    get weight() {
        return this.form.get('weight');
    }

    get email() {
        return this.form.get('email');
    }

    get phone() {
        return this.form.get('phone');
    }

    get type() {
        return this.form.get('type');
    }

    get gender() {
        return this.form.get('gender');
    }

    submit() {

        delete this.user.roles;
        this.user.firstName = this.firstName.value;
        this.user.lastName = this.lastName.value;
        this.user.email = this.email.value;
        this.user.phoneNumber = this.phone.value;

        if (this.height && this.weight) {
            this.user.height = this.height.value;
            this.user.weight = this.weight.value;
        }

        if (this.type) {
            this.user.type = this.type.value;
        }

        if (this.gender) {
            this.user.gender = this.gender.value === 'true';
        }

        this.user.currentTrainingBundles = undefined;

        this.dialogRef.close(this.user);
    }

}
