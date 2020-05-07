import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'reserve-course-event',
    templateUrl: './reserve-course-event.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ReserveCourseEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
