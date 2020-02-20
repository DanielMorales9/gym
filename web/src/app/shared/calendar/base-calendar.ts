import {Subject, Subscription} from 'rxjs';
import {ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarMonthViewDay, CalendarView} from 'angular-calendar';
import {Gym, User} from '../model';
import {EVENT_TYPES} from './event-types.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {ScreenService} from '../../core/utilities';

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

interface EventGroupMeta {
    type: string;
}

@Injectable()
export abstract class BaseCalendar implements OnInit, OnDestroy {

    protected constructor(public facade: CalendarFacade,
                          public router: Router,
                          public activatedRoute: ActivatedRoute,
                          public screenService: ScreenService) {
    }
    private sub: Subscription;

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

    EVENT_NAMES = {
        H: 'chiusura',
        T: 'ferie',
        C: 'corso',
        P: 'prenotazione'
    };

    EVENT_TYPES = {
        H: 'admin',
        T: 'trainer',
        C: 'course',
        P: 'reservation'
    };

    BADGE_TYPES = {
        H: 'light',
        T: 'secondary',
        C: 'primary',
        P: 'info'
    };

    EVENT_COLOR = {
        H: CALENDAR_COLUMNS.RED,
        T: CALENDAR_COLUMNS.RED,
        C: CALENDAR_COLUMNS.YELLOW,
        P: CALENDAR_COLUMNS.YELLOW,
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
            onClick: async ({event}: { event: CalendarEvent }): Promise<void> => {
                await this.handleEvent(EVENT_TYPES.DELETE, event);
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
    modalData: any;
    showMarker = true;
    events: CalendarEvent[];

    refresh: Subject<any> = new Subject();

    @ViewChild('next', { static: true }) next: ElementRef<HTMLElement>;
    @ViewChild('prev', { static: true }) prev: ElementRef<HTMLElement>;

    static isNotPast(date) {
        return date >= new Date();
    }

    static getPersonalEventColor(event: any) {
        return (event.reservation.confirmed) ? (event.session.completed) ?
            CALENDAR_COLUMNS.GREEN : CALENDAR_COLUMNS.BLUE : CALENDAR_COLUMNS.YELLOW;
    }

    static getCourseEventColor(event: any) {
        return (event.reservations.length > 0) ? CALENDAR_COLUMNS.BLUE : CALENDAR_COLUMNS.YELLOW;
    }

    onSwipeLeft($event: any) {
        const el: HTMLElement = this.next.nativeElement;
        el.click();
    }

    onSwipeRight($event: any) {
        const el: HTMLElement = this.prev.nativeElement;
        el.click();
    }

    isDesktop() {
        return this.screenService.isDesktop();
    }

    async ngOnInit(): Promise<void> {
        this.events = [];
        this.initView();
        this.initViewDate();
        await this.initCalendarConfig();
        await this.getUser();
        await this.getRole();
        await this.updateQueryParams();
        await this.getEvents();
        this.sub = this.activatedRoute.queryParams.subscribe(async params => {
            const hasView = 'view' in params;
            const hasViewDate = 'viewDate' in params;
            if (hasView && hasViewDate) {
                this.view = params['view'];
                this.viewDate = new Date(params['viewDate']);
                await this.getEvents();
            }
        });
    }

    ngOnDestroy(): void {
        if (!!this.sub) {
            this.sub.unsubscribe();
        }
    }

    abstract async getEvents();

    abstract delete(action: string, event: CalendarEvent);
    abstract info(action: string, event: CalendarEvent);
    abstract header(action: string, event: CalendarEvent);
    abstract async hour(action: string, event: CalendarEvent);
    abstract change(action: string, event: CalendarEvent);

    abstract openModal(action: string);

    protected async getUser() {
        this.user = this.facade.getUser();
    }

    protected async getRole() {
        this.role = this.facade.getRole();
    }

    private async initCalendarConfig() {
        const [config, error] = await this.facade.getConfig();
        if (error) {
            throw error;
        }
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
                if (this.isDesktop()) {
                    this.view = CalendarView.Week;
                }
                else {
                    this.view = CalendarView.Day;
                }
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

    async handleEvent(action: string, event: any): Promise<void> {
        switch (action) {
            case EVENT_TYPES.DELETE:
                this.delete(action, event);
                break;
            case EVENT_TYPES.INFO:
                this.info(action, event);
                break;
            case EVENT_TYPES.HOUR:
                await this.hour(action, event);
                break;
            case EVENT_TYPES.HEADER:
                this.header(action, event);
                break;
            case EVENT_TYPES.DAY:
                await this.day(action, event);
                break;
            case EVENT_TYPES.CHANGE:
                this.change(action, event);
                break;
            default:
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



    formatEvent(event: any, me?: boolean): CalendarEvent {
        const startTime = new Date(event['startTime']);
        const endTime = new Date(event['endTime']);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        const isAllDay = this.facade.isDayEvent(startTime, endTime);

        let title = event.name;

        let isDeletable;
        let isResizable;
        let color = this.EVENT_COLOR[event.type];

        switch (event.type) {
            case 'H':
                isDeletable = isResizable = this.isAdmin();
                break;
            case 'T':
                isDeletable = isResizable = this.isMyTimeOff(event);
                break;
            case 'C':
                isDeletable = true;
                isResizable = false;
                color = BaseCalendar.getCourseEventColor(event);
                break;
            case 'P':
                isDeletable = this.isReservationDeletable(event);
                isResizable = false;
                color = BaseCalendar.getPersonalEventColor(event);
                title = this.getReservationTitle(event, me);
                break;
        }

        event.eventName = this.EVENT_NAMES[event.type];

        // event.badge = this.BADGE_TYPES[event.type];
        event.type = this.EVENT_TYPES[event.type];

        const data = {
            start: startTime,
            title: title,
            color: color,
            actions: isDeletable ? this.ACTIONS : [],
            allDay: isAllDay,
            resizable: {
                beforeStart: isResizable,
                afterEnd: isResizable
            },
            draggable: false,
            meta: event
        };
        if (!isAllDay) {
            data['end'] = endTime;
        }
        return data;
    }

    beforeMonthViewRender({ body }: {
        body: Array<CalendarMonthViewDay<any>>;
    }): void {
        body.forEach(cell => {
            const groups = {};
            cell.events.forEach((event) => {
                groups[event.meta.badge] = groups[event.meta.badge] || [];
                groups[event.meta.badge].push(event);
            });
            cell['eventGroups'] = Object.entries(groups);
        });
    }

    private isReservationDeletable(event: any) {
        return event.reservation.user.id === this.user.id || !this.isCustomer();
    }

    private isMyTimeOff(event: any) {
        return event.user.id === this.user.id && this.user.type === 'T';
    }

    private getReservationTitle(event: any, me?: boolean) {
        const startTime = new Date(event['startTime']);
        const endTime = new Date(event['endTime']);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        if (this.isCustomer() && me) {
            return `Il tuo allenamento dalle ${startHour} alle ${endHour}`;
        } else {
            return `${event['reservation']['user']['lastName']} ~ Personal (${startHour} - ${endHour})`;
        }
    }

    private isCustomer(me?) {
        return this.user.type === 'C';
    }

    private isAdmin() {
        return this.user.type === 'A';
    }

    async onViewDateChanged(viewOrDate?) {
        if (viewOrDate instanceof Date) {
            this.viewDate = viewOrDate;
        } else {
            this.view = viewOrDate;
        }
        this.activeDayIsOpen = false;
        await this.updateQueryParams();
    }

    async day(action: string, event: any): Promise<void> {
        if (this.viewDate.getTime() === event.day.date.getTime()) {
            if (this.activeDayIsOpen || event.day.events.length === 0) {
                await this.getEvents();
                this.view = this.DAY;
                this.activeDayIsOpen = true;
                await this.updateQueryParams();
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        } else {
            this.viewDate = event.day.date;
            if (!this.activeDayIsOpen) {
                if (event.day.events.length === 0) {
                    await this.getEvents();
                    this.view = this.DAY;
                    await this.updateQueryParams();
                }
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
    }

    refreshView() {
        this.refresh.next();
    }

    private async updateQueryParams() {
        this.queryParams = {view: this.view, viewDate: this.viewDate};
        await this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                replaceUrl: true,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }
}

