import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'delete-holiday-event',
    templateUrl: './delete-holiday-event.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class DeleteHolidayEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
