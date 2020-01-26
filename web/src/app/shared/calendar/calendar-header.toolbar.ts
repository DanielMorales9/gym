import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CalendarView} from 'angular-calendar';

@Component({
    selector: 'calendar-header',
    templateUrl: './calendar-header.toolbar.html',
    styleUrls: ['../../styles/calendar.css', '../../styles/root.css']
})
export class CalendarHeaderToolbar {

    MONTH = CalendarView.Month;
    WEEK = CalendarView.Week;
    DAY = CalendarView.Day;

    @Input() view: CalendarView;
    @Input() viewDate: Date;
    @Input() desktop: boolean;

    @Output() done: EventEmitter<any> = new EventEmitter();

    onViewDateChanged(view?: CalendarView) {
        if (view) {
            this.done.emit(view);
        } else {
            this.done.emit(this.viewDate);
        }
    }

    isDesktop() {
        return this.desktop;
    }
}

