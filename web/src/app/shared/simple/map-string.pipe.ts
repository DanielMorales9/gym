import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'map'
})
export class MapStringPipe implements PipeTransform {

    transform(key: any, hashMap?: any): any {
        if (!!key && !!hashMap) {
            if (key in hashMap) {
                return hashMap[key];
            }
        }
        return '';
    }
}
