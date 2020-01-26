import {Component, Input} from '@angular/core';

@Component({
    selector: 'reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['../../styles/root.css']
})
export class ReservationsComponent {

    @Input()
    public events: any;

    constructor() { }

}
