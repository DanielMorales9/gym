import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ReservationsComponent {

    @Input()
    public events: any;

    constructor() { }

}
