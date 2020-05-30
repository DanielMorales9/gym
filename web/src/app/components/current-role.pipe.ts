import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'currentRole'
})
export class CurrentRolePipe implements PipeTransform {

    transform(role: number, args?: any): any {
        if (!!args) {
            return role === args;
        }
        return false;
    }
}
