import { Pipe, PipeTransform } from '@angular/core';

enum DAY_OF_WEEK {
    Domenica = 0,
    Lunedì = 1,
    Martedì = 2,
    Mercoledì = 3,
    Giovedì = 4,
    Venerdì = 5,
    Sabato = 6,
}

@Pipe({name: 'map2day'})
export class Map2DayPipe implements PipeTransform {

    transform(value: number): string {
        return DAY_OF_WEEK[value];
    }
}
