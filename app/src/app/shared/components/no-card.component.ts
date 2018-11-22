import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";

@Component({
    selector: 'no-card',
    templateUrl: './no-card.component.html',
    styleUrls: ['../../app.component.css']
})
export class NoCardComponent implements OnInit {

    @Input()
    public message: string;

    constructor() { }

    ngOnInit(): void {
    }

}