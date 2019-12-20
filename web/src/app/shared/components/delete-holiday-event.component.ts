import {Component, Input} from '@angular/core';

@Component({
    selector: 'delete-holiday-event',
    templateUrl: './delete-holiday-event.component.html',
    styleUrls: ['../../styles/root.css']
})
export class DeleteHolidayEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
