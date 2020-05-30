import {Pipe, PipeTransform} from '@angular/core';
import {Role} from '../shared/model';

@Pipe({
    name: 'showRole'
})
export class ShowRolePipe implements PipeTransform {

    transform(roles: Role[], args?: any): any {
        if (!!args) {
            return roles.filter(r => r.id === args).length === 1;
        }
        return false;
    }
}
