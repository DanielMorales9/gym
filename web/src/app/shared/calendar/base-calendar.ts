import {Subject, throwError} from 'rxjs';
import {ChangeDetectorRef, Directive, ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarMonthViewDay, CalendarView} from 'angular-calendar';
import {Gym, User} from '../model';
import {EVENT_TYPES} from './event-types.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {ScreenService, SnackBarService} from '../../core/utilities';
import {BaseComponent} from '../base-component';
import {catchError, filter, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {PolicyServiceDirective} from '../../core/policy';
import {GetPolicies} from '../policy.interface';

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

@Directive()
@Injectable()
// tslint:disable-next-line:directive-class-suffix
export abstract class BaseCalendar extends BaseComponent implements OnInit, OnDestroy, GetPolicies {

    protected constructor(public facade: CalendarFacade,
                          public router: Router,
                          public policy: PolicyServiceDirective,
                          public snackBar: SnackBarService,
                          public activatedRoute: ActivatedRoute,
                          public cdr: ChangeDetectorRef,
                          public screenService: ScreenService) {
        super();
    }

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
    EVENT_COLOR = {
        H: CALENDAR_COLUMNS.RED,
        T: CALENDAR_COLUMNS.RED,
        C: CALENDAR_COLUMNS.YELLOW,
        P: CALENDAR_COLUMNS.YELLOW,
    };

    canShowCourse: boolean;
    canShowPersonal: boolean;
    canShowTimeOff: boolean;
    canShowHoliday: boolean;

    ACTIONS: CalendarEventAction[] = [
        /*{
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('edit', event);
            }
        },*/
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent(EVENT_TYPES.DELETE, event);
            }
        }
    ];

    public view: CalendarView;
    public viewDate: Date;
    public types: any;
    public excludeDays: number[];
    public dayStartHour: number;
    public dayEndHour: number;
    public hourSegments: number;
    public weekStartsOn: number = 1;
    public activeDayIsOpen: boolean;
    public currentRoleId: number;
    public gym: Gym;
    private queryParams: {view: CalendarView, viewDate: Date, types: any};
    user: User;
    modalData: any;
    showMarker = true;
    events: CalendarEvent[];

    refresh$ = new Subject();

    @ViewChild('next', { static: true }) next: ElementRef<HTMLElement>;
    @ViewChild('prev', { static: true }) prev: ElementRef<HTMLElement>;

    static getPersonalEventColor(event: any) {
        return (event.reservations[0].confirmed) ? (event.reservations[0].session.completed) ?
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

    ngOnInit(): void {
        this.initView();
        this.initViewDate();
        this.getPolicies();
        this.initEventTypes();
        this.initCalendarConfig();
        this.getUser();
        this.getRole();
        this.updateQueryParams();

        this.activatedRoute.queryParams
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(params => 'view' in params && 'viewDate' in params),
                throttleTime(300)
            )
            .subscribe(params => {
                this.events = [];
                this.view = params['view'];
                this.viewDate = new Date(params['viewDate']);
                this.types = JSON.parse(params['types'])['types'];
                this.getEvents();
            });
    }

    abstract getEvents();

    abstract delete(action: string, event: CalendarEvent);
    abstract info(action: string, event: CalendarEvent);
    abstract header(action: string, event: CalendarEvent);
    abstract hour(action: string, event: CalendarEvent);
    abstract change(action: string, event: CalendarEvent);

    abstract openModal(action: string);

    protected getUser() {
        this.user = this.facade.getUser();
    }

    protected getRole() {
        this.currentRoleId = this.facade.getCurrentRoleId();
    }

    private initCalendarConfig() {
        this.facade.getConfig()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((config: Gym) => {
                this.gym = config;
                this.dayStartHour = 24;
                this.dayEndHour = 0;
                const split = config.minutesBetweenEvents;
                if (!split || split === 0) {
                    this.hourSegments = 1;
                }
                else {
                    this.hourSegments = Math.ceil(60 / split);
                }

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
                this.cdr.detectChanges();
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

    private initEventTypes() {
        const types = this.activatedRoute.snapshot.queryParamMap.get('types');
        if (!!types) {
            this.types = JSON.parse(types)['types'];
        } else {

            this.types = [];
            if (this.canShowCourse) {
                this.types.push('C');
            }
            if (this.canShowPersonal) {
                this.types.push('P');
            }
            if (this.canShowTimeOff) {
                this.types.push('T');
            }
            if (this.canShowHoliday) {
                this.types.push('H');
            }
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
                break;
        }
    }

    public getStartAndEndTimeByView() {
        let startDay;
        let endDay;
        const month = this.viewDate.getMonth();
        const year = this.viewDate.getFullYear();
        const date = this.viewDate.getDate();
        const dayOfWeek = this.viewDate.getDay();

        const from = (7 - this.weekStartsOn + dayOfWeek) % 7
        const to = 6 - from
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
                startDay = new Date(year, month, date - from, hour, min, sec);
                endDay = new Date(year, month, date + to, hour + 23, min + 59, sec + 59);
                break;
            default:
                startDay = new Date(year, month, date, hour, min, sec);
                endDay = new Date(year, month, date, hour + 23, 59, 59);
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
        return event.reservations[0].user.id === this.user.id || !this.isCustomer();
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
            return `${event['reservations'][0]['user']['lastName']} ~ Personal (${startHour} - ${endHour})`;
        }
    }

    private isCustomer(me?) {
        return this.user.type === 'C';
    }

    private isAdmin() {
        return this.user.type === 'A';
    }

    onViewDateChanged(viewOrDate?) {
        if (viewOrDate instanceof Date) {
            this.viewDate = viewOrDate;
        } else {
            this.view = viewOrDate;
        }
        this.activeDayIsOpen = false;
        this.updateQueryParams();
    }

    day(action: string, event: any): void {
        if (this.viewDate.getTime() === event.day.date.getTime()) {
            if (this.activeDayIsOpen || event.day.events.length === 0) {
                this.getEvents();
                this.view = this.DAY;
                this.activeDayIsOpen = true;
                this.updateQueryParams();
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        } else {
            this.viewDate = event.day.date;
            if (!this.activeDayIsOpen) {
                if (event.day.events.length === 0) {
                    this.getEvents();
                    this.view = this.DAY;
                    this.updateQueryParams();
                }
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
    }

    refreshView() {
        this.refresh$.next();
    }

    protected confirmReservation(data) {
        this.facade.confirmReservation(data.eventId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                r => {
                    this.snackBar.open('Prenotazione confermata');
                    this.getEvents();
                }, err => this.snackBar.open(err.error()));
    }

    protected completeEvent(data) {
        this.facade.completeEvent(data.eventId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => {
                this.snackBar.open('Allenamento completato');
                this.getEvents();
            }, err => this.snackBar.open(err.error.message));
    }

    protected createReservation(d) {
        const userId = d.userId;
        const specId = d.event.meta.specification.id;
        this.facade.getUserBundleBySpecId(userId, specId)
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError(err => throwError(err)),
                switchMap(res => {
                    if (res.length === 0) {
                        throw Error('Non possiedi questo pacchetto');
                    }
                    return this.facade.createReservationFromEvent(d.userId, d.event.meta.id, res[0].id);
                })
            )
            .subscribe(res => {
                this.snackBar.open('Prenotazione effettuata');
                this.getEvents();
            }, e => this.snackBar.open(e.message || e.error.message, undefined,  {duration: 5000}));
    }

    protected createReservationFromBundle({userId, bundleId, startTime, endTime, external}) {
        this.facade.createReservationFromBundle(userId, bundleId,
            { startTime: startTime, endTime: endTime, external: external})
            .subscribe(res => {
                this.snackBar.open('Prenotazione effettuata');
                this.getEvents();
            }, err => {
                if (err.error) {
                    this.snackBar.open(err.error.message);
                }
            });
    }

    protected deleteReservation(data) {
        this.facade.deleteReservation(data)
            .subscribe(res => {
                this.snackBar.open('La Prenotazione è stata eliminata');
                this.getEvents();
            }, err => {
                if (err.error) {
                    this.snackBar.open(err.error.message, undefined, {duration: 5000});
                }
            });
    }


    protected deleteTimeOff(data) {
        this.facade.deleteTimeOff(data.eventId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => {
                this.snackBar.open('Ferie cancellate');
                this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    protected createHoliday(data) {
        this.facade.createHoliday(data.eventName, data.start, data.end)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => {
                this.snackBar.open('Chiusura confermata');
                this.getEvents();
            }, err => this.snackBar.open(err.error.message));
    }

    protected deleteHoliday(data) {
        this.facade.deleteHoliday(data.eventId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
                this.snackBar.open('La chiusura è stata eliminata');
                this.getEvents();
            }, err => this.snackBar.open(err.error.message));
    }

    protected deleteCourseEvent(data: any) {
        this.facade.deleteCourseEvent(data.eventId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => {
                this.snackBar.open('Evento eliminato');
                this.getEvents();
            }, error => this.snackBar.open(error.error.message));
    }

    protected createCourseEvent(data: any) {
        this.facade.createCourseEvent(data.eventName, data.meta, data.start, data.end, data.external, data.maxCustomers)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe( r => {
                this.snackBar.open('Evento creato');
                this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    protected editHoliday(data) {
        this.facade.editHoliday(data.eventId, {name: data.eventName, startTime: data.start, endTime: data.end})
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => {
                this.snackBar.open('Chiusura confermata');
                this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    protected editTimeOff(data) {
        this.facade.editTimeOff(data.eventId, data.start, data.end, data.eventName)
            .subscribe( res => {
                this.snackBar.open('Ferie richieste');
                this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    protected createTimeOff(data: any, end?: Date) {
        this.facade.createTimeOff(data.userId, data.name, data.start, end)
            .subscribe(res => {
                this.snackBar.open('Ferie richieste');
                this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    protected updateQueryParams() {
        this.queryParams = {
            view: this.view,
            viewDate: this.viewDate,
            types: JSON.stringify({types: this.types})
        };

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                replaceUrl: true,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
    }

    getPolicies() {
        const userId = this.activatedRoute.snapshot.paramMap.get('id');
        this.canShowCourse = this.policy.get('events', 'canShowCourse');
        this.canShowPersonal = this.policy.get('events', 'canShowPersonal');
        this.canShowTimeOff = this.policy.get('events', 'canShowTimeOff') && !userId;
        this.canShowHoliday = this.policy.get('events', 'canShowHoliday');
    }
}

