import {Subject} from "rxjs";
import {Injectable, Input, OnInit} from "@angular/core";
import {
    CalendarEvent, CalendarEventAction, CalendarMonthViewDay, CalendarMonthViewEventTimesChangedEvent,
    CalendarView,
} from "angular-calendar";
import {User} from "../../shared/model";
import {TimesOffService, TrainingService, UserHelperService} from "../../shared/services";
import {GymConfigurationService, NotificationService} from "../../services";
import {EVENT_TYPES} from "./event-types.enum";
import {WeekDay} from "@angular/common";

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

    @Input() public view: CalendarView;
    @Input() public viewDate: Date;
    @Input() public excludeDays: number[];
    @Input() public dayStartHour: number;
    @Input() public dayEndHour: number;
    @Input() public weekStartsOn: number;
    @Input() public activeDayIsOpen: boolean;

    @Input() public role: number;
    @Input() public email: string;


    user: User;
    modalData: { role: number; action: string; title: string; userId: number, event: any };
    public message: {text: string, class: string};

    events: CalendarEvent[];

    refresh: Subject<any> = new Subject();

    constructor(private userHelperService: UserHelperService,
                public notificationService: NotificationService,
                public trainingService: TrainingService,
                public timesOffService: TimesOffService,
                public gymConf: GymConfigurationService) {

    }

    ngOnInit(): void {
        this.userHelperService.getUserByEmail(this.email, (res: User) => {
            this.user = res;
            this.getEvents()
        });
    }

    abstract getEvents();
    abstract getReservations();
    abstract getTimesOff();

    abstract delete(action: string, event: CalendarEvent);
    abstract info(action: string, event: CalendarEvent);
    abstract header(action: string, event: CalendarEvent);
    abstract hour(action: string, event: CalendarEvent);

    abstract openModal(action: string);

    handleEvent(action: string, event: CalendarEvent): void {
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
            default:
                console.log('handleEvent');
                break;
        }
    }


    getStartAndEndTimeByView() {
        let startDay;
        let endDay;
        let month = this.viewDate.getMonth();
        let year = this.viewDate.getFullYear();
        let date = this.viewDate.getDate();
        let dayOfWeek = this.viewDate.getDay();
        let hour = 0;
        let min = 0;

        switch (this.view) {
            case this.MONTH:
                let nextMonth = month + 1;
                startDay = new Date(year, month, 1, hour, min);
                endDay = new Date(year, nextMonth, 0, hour, min);
                break;
            case this.WEEK:
                startDay = new Date(year, month, date - dayOfWeek, hour, min);
                endDay = new Date(year, month, date + (7 - dayOfWeek), hour, min);
                break;
            default:
                startDay = new Date(year, month, date, hour, min);
                endDay = new Date(year, month, date, hour + 24, min);
                break;
        }
        return {startDay, endDay};
    }

    formatEvent(event: any) : CalendarEvent {
        console.log(event);
        let startTime = new Date(event['startTime']);
        let endTime = new Date(event['endTime']);
        let allDay = Math.abs(endTime.getTime() - startTime.getTime()) / 36e5 ;
        let startHour = startTime.getHours();
        let endHour = endTime.getHours();

        let title;
        let isATimeOff = !!event.type;
        if (isATimeOff) {
            title = event.name;
            event.eventName = (event.type == "admin") ? "chiusura" : "ferie";
        }
        else {
            event.type = "reservation";
            event.eventName = "prenotazione";
            if (this.role == 3) {
                title = `Il tuo allenamento dalle ${startHour} alle ${endHour}`
            } else {
                title = `Allenamento ${startHour} - ${endHour} di ${event['user']['lastName']}`
            }
        }
        let isMyEvent = event.user.id == this.user.id;
        let isDeletable = this.role == 1 || (event.type == 'reservation' && this.role < 3) || isMyEvent;
        return {
            start: startTime,
            end: endTime,
            title: title,
            color: (isATimeOff) ? CALENDAR_COLUMNS.RED : (event.confirmed) ? CALENDAR_COLUMNS.BLUE : CALENDAR_COLUMNS.YELLOW,
            actions: isDeletable ? this.ACTIONS: [],
            allDay: allDay == (this.dayEndHour - this.dayStartHour),
            resizable: {
                beforeStart: false,
                afterEnd: false
            },
            draggable: false,
            meta: event
        }
    }

    onViewDateChanged(view?: CalendarView) {
        if (!!view) {
            this.view = view;
        }
        this.activeDayIsOpen = false;
        this.getEvents();
    }

    day(action: string, event: any): void {
        if (this.viewDate.getTime() === event.day.date.getTime()) {
            if (this.activeDayIsOpen || event.day.events.length == 0) {
                this.getEvents();
                this.view = this.DAY;
                this.activeDayIsOpen = true;
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
        else {
            this.viewDate = event.day.date;
            if (!this.activeDayIsOpen) {
                if (event.day.events.length == 0) {
                    this.getEvents();
                    this.view = this.DAY;
                }
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
    }


    refreshView() {
        console.log(this.events);
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