import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CalendarView} from 'angular-calendar';

@Component({
    selector: 'calendar-header',
    templateUrl: './calendar-header.toolbar.html',
    styleUrls: ['../../../styles/calendar.css', '../../../styles/root.css']
})
export class CalendarHeaderToolbar {

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

