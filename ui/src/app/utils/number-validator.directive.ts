import { Directive, forwardRef, Attribute } from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS, ValidatorFn, ValidationErrors} from '@angular/forms';

@Directive({
    selector: '[numeric][formControlName],[numeric][formControl],[numeric][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NumberValidator), multi: true }
    ]
})
export class NumberValidator implements Validator{
    constructor(@Attribute('numeric') public numeric: string) {
    }

    registerOnValidatorChange(fn: () => void): void {
    }

    validate(c: AbstractControl): ValidationErrors | null {
        let number = /^[.\d]+$/.test(c.value) ? +c.value : NaN;
        if (number !== number) {
            return { 'value': true };
        }

        return null;
    }
}