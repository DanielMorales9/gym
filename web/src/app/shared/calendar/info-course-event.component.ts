import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'info-course-event',
    templateUrl: './info-course-event.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class InfoCourseEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
