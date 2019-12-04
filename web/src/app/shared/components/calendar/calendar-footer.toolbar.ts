import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CalendarView} from 'angular-calendar';

@Component({
    selector: 'calendar-footer',
    templateUrl: './calendar-footer.toolbar.html',
    styleUrls: ['../../../styles/calendar.css', '../../../styles/root.css']
})
export class CalendarFooterToolbar {

    MONTH = CalendarView.Month;
    WEEK = CalendarView.Week;
    DAY = CalendarView.Day;

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

