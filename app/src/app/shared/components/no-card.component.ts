import {Component, Input} from "@angular/core";

@Component({
    selector: 'no-card',
    templateUrl: './no-card.component.html',
    styleUrls: ['../../app.component.css']
})
export class NoCardComponent {

    @Input()
    public message: string;

    constructor() { }

}