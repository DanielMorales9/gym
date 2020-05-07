import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'delete-reservation-course-event',
    templateUrl: './delete-reservation-course-event.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class DeleteReservationCourseEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
