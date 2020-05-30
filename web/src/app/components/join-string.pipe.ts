import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'join'
})
export class JoinStringPipe implements PipeTransform {

    transform(strings: string[], args?: any): any {
        if (!!strings && !!args) {
            return strings.join(args);
        }
        return '';
    }
}
