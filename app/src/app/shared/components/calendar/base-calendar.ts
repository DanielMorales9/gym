import {Subject} from 'rxjs';
import {Injectable, OnInit} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarMonthViewDay, CalendarView} from 'angular-calendar';
import {Gym, User} from '../../model';
import {EVENT_TYPES} from './event-types.enum';
import {ActivatedRoute, Router} from '@angular/router';
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

    DAY_OF_WEEK = {
        sunday : 0,
        monday : 1,
        tuesday : 2,
        wednesday : 3,
        thursday : 4,
        friday : 5,
        saturday : 6,
    };

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
    public gym: Gym;
    private queryParams: {view: CalendarView, viewDate: Date};
    user: User;
    modalData: { role: number; action: string; title: string; userId: number, event: any };

    events: CalendarEvent[];

    refresh: Subject<any> = new Subject();

    protected constructor(public facade: CalendarFacade,
                          public router: Router,
                          public activatedRoute: ActivatedRoute) {
    }

    static isNotPast(date) {
        return date >= new Date();
    }

    ngOnInit(): void {
        this.events = [];
        this.getUser();
        this.getRole();
        this.initView();
        this.initViewDate();
        this.updateQueryParams();
        this.initCalendarConfig();
        this.getEvents();
    }

    abstract getEvents();

    abstract delete(action: string, event: CalendarEvent);
    abstract info(action: string, event: CalendarEvent);
    abstract header(action: string, event: CalendarEvent);
    abstract hour(action: string, event: CalendarEvent);
    abstract change(action: string, event: CalendarEvent);

    abstract openModal(action: string);

    private getUser() {
        this.user = this.facade.getUser();
    }

    private getRole() {
        this.role = this.facade.getRole();
    }

    private initCalendarConfig() {
        this.facade.getConfig().subscribe((config: Gym) => {
            this.gym = config;
            this.dayStartHour = 24;
            this.dayEndHour = 0;
            this.excludeDays = [];
            // tslint:disable-next-line:forin
            for (const key in this.DAY_OF_WEEK) {
                if (!config[key + 'Open']) {
                    this.excludeDays.push(this.DAY_OF_WEEK[key.replace('Open', '')]);
                } else {
                    this.dayStartHour = Math.min(this.dayStartHour, config[key + 'StartHour']);
                    this.dayEndHour = Math.max(this.dayEndHour, config[key + 'EndHour'] - 1);
                }

            }

            this.weekStartsOn = this.DAY_OF_WEEK[config.weekStartsOn.toLowerCase()];
        });
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
        const stringDate = this.activatedRoute.snapshot.queryParamMap.get('viewDate');
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

    isGymOpenOnDate(date) {
        return this.facade.isGymOpenOnDate(date);
    }

    isInGymHours(start, end?) {
        const gymStartHour = this.facade.getStartHourByDate(start);
        const gymEndHour = this.facade.getEndHourByDate(start);
        const startHour = start.getHours();
        let endHour = startHour;
        if (end) { endHour = end.getHours(); }
        return gymStartHour <= startHour && endHour <= gymEndHour;
    }

    isValidHour(event: any) {
        return BaseCalendar.isNotPast(event.date) && this.isGymOpenOnDate(event.date) && this.isInGymHours(event.date);
    }

    isValidChange(event: any) {
        const start = event.event.start;
        const end = event.event.end;
        const isStartNotPast = BaseCalendar.isNotPast(start);
        const isEndNotPast = BaseCalendar.isNotPast(end);
        const isGymOpen = this.isGymOpenOnDate(start);
        return isStartNotPast && isEndNotPast && isGymOpen && this.isInGymHours(start, end);
    }

    isValidHeader(event: any) {
        return BaseCalendar.isNotPast(event.day.date) && this.isGymOpenOnDate(event.day.date);
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
        const isAllDay = this.facade.isDayEvent(startTime, endTime);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        let title;
        const isNotReservation = !!event.type;
        if (isNotReservation) {
            title = event.name;
            event.eventName = (event.type === 'H') ? 'chiusura' : 'ferie';
            event.type = (event.type === 'H') ? 'admin' : 'trainer';
        } else {
            event.type = 'reservation';
            event.eventName = 'prenotazione';
            if (this.user.type === 'C') {
                title = `Il tuo allenamento dalle ${startHour} alle ${endHour}`;
            } else {
                title = `Allenamento ${startHour} - ${endHour} di ${event['user']['lastName']}`;
            }
        }

        const isMyEvent = (event.user) ? event.user.id === this.user.id : false;
        const isDeletable = this.user.type === 'A' || (event.type === 'reservation' && this.user.type !== 'C') || isMyEvent;
        const isResizable = isNotReservation && (isMyEvent || this.user.type === 'A');
        return {
            start: startTime,
            end: endTime,
            title: title,
            color: (isNotReservation) ? CALENDAR_COLUMNS.RED : (event.confirmed) ? CALENDAR_COLUMNS.BLUE : CALENDAR_COLUMNS.YELLOW,
            actions: isDeletable ? this.ACTIONS : [],
            allDay: isAllDay,
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
        this.updateQueryParams();
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


    private updateQueryParams() {
        this.queryParams = {view: this.view, viewDate: this.viewDate};
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }
}
