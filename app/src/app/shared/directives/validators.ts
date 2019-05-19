import {AbstractControl} from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
        // if they don't match, set an error in our confirmPassword form control
        control.get('confirmPassword').setErrors({ noPasswordMatch: true });
    }
}

export function rangeValidator(start: string, end: string) {

    function innerValidator(control: AbstractControl) {
        const startC = control.get(start);
        const endC = control.get(end);
        const startV: string = startC.value;
        const endV: string = endC.value;
        // compare
        if (startV > endV) {
            endC.setErrors({ range: true });
        }
    }
    return innerValidator;
}
