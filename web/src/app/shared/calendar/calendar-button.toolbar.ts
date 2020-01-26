import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CalendarView} from 'angular-calendar';

@Component({
    selector: 'calendar-button',
    templateUrl: './calendar-button.toolbar.html',
    styleUrls: ['../../styles/calendar.css', '../../styles/root.css']
})
export class CalendarButtonToolbar {

    @Input() view: CalendarView;
    @Input() viewDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();

    onViewDateChanged(view?: CalendarView) {
        if (view) {
            this.done.emit(view);
        } else {
            this.done.emit(this.viewDate);
        }
    }
}

