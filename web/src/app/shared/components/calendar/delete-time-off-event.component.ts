import {Component, Input} from '@angular/core';

@Component({
    selector: 'delete-time-off-event',
    templateUrl: './delete-time-off-event.component.html',
    styleUrls: ['../../../styles/root.css']
})
export class DeleteTimeOffEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
