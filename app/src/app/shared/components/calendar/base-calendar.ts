import {Subject} from 'rxjs';
import {Injectable, OnInit} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarMonthViewDay, CalendarView,} from 'angular-calendar';
import {User} from '../../model';
import {EVENT_TYPES} from './event-types.enum';
import {ActivatedRoute} from '@angular/router';
import {CalendarFacade} from '../../../services';

const CALENDAR_COLUMNS: any = {
    RED: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    BLUE: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    YELLOW: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    GREEN: {
        primary: '#0ee300',
        secondary: '#9fe370'
    }
};

@Injectable()
export abstract class BaseCalendar implements OnInit {

    MONTH = CalendarView.Month;
    WEEK = CalendarView.Week;
    DAY = CalendarView.Day;

    ACTIONS: CalendarEventAction[] = [
        /*{
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('edit', event);
            }
        },*/
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent(EVENT_TYPES.DELETE, event);
            }
        }
    ];

    public view: CalendarView;
    public viewDate: Date;
    public excludeDays: number[];
    public dayStartHour: number;
    public dayEndHour: number;
    public weekStartsOn: number;
    public activeDayIsOpen: boolean;

    public role: number;

    user: User;
    modalData: { role: number; action: string; title: string; userId: number, event: any };
    public message: {text: string, class: string};

    events: CalendarEvent[];

    refresh: Subject<any> = new Subject();

    protected constructor(public facade: CalendarFacade,
                          public activatedRoute: ActivatedRoute) {
    }



    ngOnInit(): void {
        this.events = [];
        this.getUser();
        this.initView();
        this.initViewDate();
        this.initCalendarConfig();
        this.getEvents();
    }

    abstract getEvents();
    getReservations() {}
    getTimesOff() {}

    abstract delete(action: string, event: CalendarEvent);
    abstract info(action: string, event: CalendarEvent);
    abstract header(action: string, event: CalendarEvent);
    abstract hour(action: string, event: CalendarEvent);
    abstract change(action: string, event: CalendarEvent);

    abstract openModal(action: string);

    private getUser() {
        this.user = this.facade.getUser();
    }

    private initCalendarConfig() {
        const config = this.facade.getConfig();
        this.dayEndHour = config.dayEndHour;
        this.dayStartHour = config.dayStartHour;
        this.excludeDays = config.excludeDays;
        this.weekStartsOn = config.weekStartsOn;
    }

    private initView() {
        const view = this.activatedRoute.snapshot.queryParamMap.get('view');

        switch (view) {
            case 'month':
                this.view = CalendarView.Month;
                break;
            case 'week':
                this.view = CalendarView.Week;
                break;
            case 'day':
                this.view = CalendarView.Day;
                break;
            default:
                this.view = CalendarView.Month;
                break;
        }
    }

    private initViewDate() {
        const stringDate = this.activatedRoute.snapshot.queryParamMap.get('date');
        if (stringDate) {
            this.viewDate = new Date(stringDate.replace('-', '/'));
        } else {
            this.viewDate = new Date();
        }
    }

    handleEvent(action: string, event: any): void {
        switch (action) {
            case EVENT_TYPES.DELETE:
                this.delete(action, event);
                break;
            case EVENT_TYPES.INFO:
                this.info(action, event);
                break;
            case EVENT_TYPES.HOUR:
                this.hour(action, event);
                break;
            case EVENT_TYPES.HEADER:
                this.header(action, event);
                break;
            case EVENT_TYPES.DAY:
                this.day(action, event);
                break;
            case EVENT_TYPES.CHANGE:
                this.change(action, event);
                break;
            default:
                console.log('handleEvent');
                break;
        }
    }


    getStartAndEndTimeByView() {
        let startDay;
        let endDay;
        const month = this.viewDate.getMonth();
        const year = this.viewDate.getFullYear();
        const date = this.viewDate.getDate();
        const dayOfWeek = this.viewDate.getDay();
        const hour = 0;
        const min = 0;
        const sec = 0;

        switch (this.view) {
            case this.MONTH:
                const nextMonth = month + 1;
                startDay = new Date(year, month, 1, hour, min, sec);
                endDay = new Date(year, nextMonth, 0, 23, 59, 59);
                break;
            case this.WEEK:
                startDay = new Date(year, month, date - dayOfWeek, hour, min, sec);
                endDay = new Date(year, month, date + (7 - dayOfWeek), 23, 59, 59);
                break;
            default:
                startDay = new Date(year, month, date, hour, min, sec);
                endDay = new Date(year, month, date, hour + 24, 59, 59);
                break;
        }
        return {startDay, endDay};
    }

    formatEvent(event: any): CalendarEvent {
        const startTime = new Date(event['startTime']);
        const endTime = new Date(event['endTime']);
        const allDay = Math.abs(endTime.getTime() - startTime.getTime()) / 36e5 ;
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        let title;
        const isATimeOff = !!event.type;
        if (isATimeOff) {
            title = event.name;
            event.eventName = (event.type === 'admin') ? 'chiusura' : 'ferie';
        } else {
            event.type = 'reservation';
            event.eventName = 'prenotazione';
            if (this.role === 3) {
                title = `Il tuo allenamento dalle ${startHour} alle ${endHour}`;
            } else {
                title = `Allenamento ${startHour} - ${endHour} di ${event['user']['lastName']}`;
            }
        }
        const isMyEvent = event.user.id === this.user.id;
        const isDeletable = this.role === 1 || (event.type === 'reservation' && this.role < 3) || isMyEvent;
        const isResizable = isATimeOff && isMyEvent;
        return {
            start: startTime,
            end: endTime,
            title: title,
            color: (isATimeOff) ? CALENDAR_COLUMNS.RED : (event.confirmed) ? CALENDAR_COLUMNS.BLUE : CALENDAR_COLUMNS.YELLOW,
            actions: isDeletable ? this.ACTIONS : [],
            allDay: allDay === (this.dayEndHour - this.dayStartHour),
            resizable: {
                beforeStart: isResizable,
                afterEnd: isResizable
            },
            draggable: false,
            meta: event
        };
    }

    onViewDateChanged(viewOrDate?) {
        if (viewOrDate instanceof Date) {
            this.viewDate = viewOrDate;
        } else {
            this.view = viewOrDate;
        }
        this.activeDayIsOpen = false;
        this.getEvents();
    }

    day(action: string, event: any): void {
        if (this.viewDate.getTime() === event.day.date.getTime()) {
            if (this.activeDayIsOpen || event.day.events.length === 0) {
                this.getEvents();
                this.view = this.DAY;
                this.activeDayIsOpen = true;
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        } else {
            this.viewDate = event.day.date;
            if (!this.activeDayIsOpen) {
                if (event.day.events.length === 0) {
                    this.getEvents();
                    this.view = this.DAY;
                }
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
    }


    refreshView() {
        this.refresh.next();
    }

    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        body.forEach(cell => {
            const groups: any = {};
            cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
                groups[event.meta.type] = groups[event.meta.type] || [];
                groups[event.meta.type].push(event);
            });
            cell['eventGroups'] = Object.entries(groups);
        });
    }


}
