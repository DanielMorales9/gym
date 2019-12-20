import {Component, Input} from '@angular/core';

@Component({
    selector: 'gym-closed',
    templateUrl: './gym-closed.component.html',
    styleUrls: ['../../styles/root.css']
})
export class GymClosedComponent {

    @Input()
    public event: any;

    constructor() { }

}
