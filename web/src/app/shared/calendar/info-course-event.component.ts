import {Component, Input} from '@angular/core';

@Component({
    selector: 'info-course-event',
    templateUrl: './info-course-event.component.html',
    styleUrls: ['../../styles/root.css']
})
export class InfoCourseEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
