import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from "@angular/core";

import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent, CalendarMonthViewDay,
    CalendarView,
    DAYS_OF_WEEK
} from "angular-calendar";
import 'rxjs/add/operator/finally';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {User} from "../../shared/model";
import {
    NotificationService,
    TimesOffService,
    TrainingService, UserHelperService
} from "../../shared/services";
import {AppService} from "../../app.service";
import {ChangeViewService} from "../../services/change-view.service";


const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    green: {
        primary: '#0ee300',
        secondary: '#9fe370'
    }
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './booking.component.html',
    styleUrls: ['../../app.component.css']
})
export class BookingComponent implements OnInit {

    current_role_view: number;

    @ViewChild('modalContent')
    modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    user: User;

    dayStartHour: number = 8;

    dayEndHour: number = 22;

    CalendarView = CalendarView;

    excludeDays: number[] = [0, 6];

    weekStartsOn = DAYS_OF_WEEK.MONDAY;

    viewDate: Date = new Date();
    activeDayIsOpen :boolean = false;


    modalData: {
        action: string;
        title: string;
        role: number;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        /*{
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('edit', event);
            }
        },*/
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('delete', event);
            }
        }
    ];
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[];
    loading : boolean;
    timeOffName: string = "";

    constructor(private appService: AppService,
                private modal: NgbModal,
                private messageService: NotificationService,
                private userHelperService: UserHelperService,
                private changeViewService: ChangeViewService,
                private trainingService: TrainingService,
                private timesOffService: TimesOffService) {
        this.current_role_view = this.appService.current_role_view;
        console.log(this.changeViewService.id);
        this.changeViewService.getView().subscribe(value => {
            console.log(value);
            this.current_role_view = value
        });
        this.loading = false;
    }

    ngOnInit(): void {
        this.userHelperService.getUserByEmail(this.appService.user.email, (res: User) => {
            this.user = res;
            this.getEvents()
        });
    }

    private getEvents() : void {
        this.events = [];
        switch (this.current_role_view) {
            case 3:
                this.getReservations(this.user.id);
                this.timesOff(undefined, "admin");
                break;
            case 2:
                this.getReservations();
                this.timesOff(this.user.id);
                this.timesOff(undefined, "admin");
                break;
            case 1:
                this.getReservations();
                this.timesOff();
                break;
            default:
                break;
        }
        this.events = [];
    }

    private timesOff(id?: number, type?: string) {
        let {startDay, endDay} = this.getStartAndEndTimeByView();
        this.timesOffService.getTimesOff(startDay, endDay, res => {
            res.map(res => {
                this.events.push(this.formatEvent(res))
            });
            this.refreshView();
        }, undefined, id, type);
    }

    private getReservations(id?: number) {
        let {startDay, endDay} = this.getStartAndEndTimeByView();
        this.trainingService.getReservations(startDay, res => {
            res.forEach(res => {
                this.events.push(this.formatEvent(res))
            });
            this.refreshView();
        }, err => {
        }, id, endDay);
    }

    private checkClosable(action, role, date, event) {

        if (date < new Date()) {
            return;
        }
        let title = (role == 1)? "Giorno di chiusura": "Giorno di Ferie";
        let type = (role == 1)? "admin" : "trainer";
        let {startTime, endTime} = this.getStartAndEndTimeByGymConfiguration(new Date(date));
        this.timesOffService.check(startTime, endTime, type, this.user.id,res => {
            this.modalData = { action, title, role, event };
            this.modal.open(this.modalContent);
        }, err => {
            let message = {
                text: err.error,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        });
    }

    private getStartAndEndTimeByGymConfiguration(date) {
        let startTime = date;
        let endTime = new Date(date);
        startTime.setHours(startTime.getHours() + this.dayStartHour);
        endTime.setHours(endTime.getHours() + this.dayEndHour);
        return {startTime, endTime};
    }

    private checkAvailability(action, role, date, event) {
        if (date < new Date()) {
            return;
        }
        let title = "Prenota il tuo allenamento!";
        this.trainingService.check(date, this.user.id,res => {
            this.modalData = { action, title, role, event };
            this.modal.open(this.modalContent);
        }, err => {
            let message = {
                text: err.error,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        });
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

    book(data) {
        switch(data.role) {
            case 1:
                this.bookTimeOff(data.event.day.date);
                break;
            case 3:
                this.bookReservation(data.event.date);
                break;
            default:
                break;
        }
    }

    eventTimesChanged({ event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        let role = this.current_role_view;
        let title;
        console.log(action, event);
        switch (action) {
            case 'delete':
                title = "Sei sicuro di voler eliminare la " + event.meta.eventName + " ?";
                break;
            case 'info':
                title = event.title;
                break;
            default:
                break;
        }

        this.modalData = { action, title, role, event};
        this.modal.open(this.modalContent);
    }

    complete(event: CalendarEvent) {
        this.loading = true;
        let stringDate = BookingComponent.getDateString(event.start);
        this.trainingService.complete(event.meta.id, (res) => {
            this.loading = false;
            let message = {
                text: "Allenamento #" + event.meta.session.id + " completato",
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.modal.dismissAll();
            this.getEvents();
            this.refreshView();
        }, (err) => {
            this.modal.dismissAll();
            this.loading = false;
            let message = {
                text: err.error.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        })
    }

    confirm(event: CalendarEvent) {
        this.loading = true;
        let stringDate = BookingComponent.getDateString(event.start);
        this.trainingService.confirm(event.meta.id, (res) => {
            this.loading = false;
            let message = {
                text: "Prenotazione #" + event.meta.id + " confermata per il " + stringDate,
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.modal.dismissAll();
            this.getEvents();
            this.refreshView();
        }, (err) => {
            this.modal.dismissAll();
            this.loading = false;
            let message = {
                text: err.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        })
    }

    delete(modalData) {
        switch (modalData.event.meta.type) {
            case "reservation":
                this.deleteReservation(modalData);
                break;
            case "admin":
                this.deleteTimeOff(modalData);
                break;
            case "trainer":
                break;
            default:
                break;
        }
    }

    deleteReservation(modalData) {
        this.loading = true;
        let event = modalData.event;
        this.trainingService.delete(event.meta.id, res => {
            this.loading = false;
            let that = this;
            setTimeout(function() {
                that.getEvents();
                that.refreshView();
            }, 1000);
            this.modal.dismissAll();
            let message = {
                text: "La Prenotazione è stata eliminata!",
                class: "alert-warning"
            };
            this.messageService.sendMessage(message);
            this.events = this.events.filter(iEvent => iEvent !== event);
        }, err => {
            this.loading = false;
            let message = {
                text: err.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
            this.modal.dismissAll();
        })
    }

    deleteTimeOff (modalData) {
        let type = modalData.event.meta.type;
        let isDeletable = ((this.current_role_view == 1 && type=='admin') ||
            (this.current_role_view <3 && type=='trainer'));
        if (isDeletable) {
            let event = modalData.event;
            this.timesOffService.delete(event.meta.id, res => {
                this.loading = false;
                let that = this;
                setTimeout(function () {
                    that.getEvents();
                    that.refreshView();
                }, 1000);
                this.modal.dismissAll();
                let message = {
                    text: event.meta.eventName + " è stata eliminata!",
                    class: "alert-warning"
                };
                this.messageService.sendMessage(message);
                this.events = this.events.filter(iEvent => iEvent !== event);
            }, err => {
                this.loading = false;
                let message = {
                    text: err.message,
                    class: "alert-danger"
                };
                this.messageService.sendMessage(message);
                this.modal.dismissAll();
            })
        }
    }

    private formatEvent(res: any) {
        let startTime = new Date(res['startTime']);
        let endTime = new Date(res['endTime']);
        let allDay = Math.abs(endTime.getTime() - startTime.getTime()) / 36e5 ;
        let startHour = startTime.getHours();
        let endHour = endTime.getHours();

        let title;
        let isATimeOff = res.type !== undefined;
        if (isATimeOff) {
            title = res.name;
            res.eventName = (res.type == "admin") ? "chiusura" : "ferie";
        }
        else {
            res.type = "reservation";
            res.eventName = "prenotazione";
            if (this.current_role_view == 3) {
                title = 'Il tuo allenamento dalle ' + startHour + ' alle ' + endHour;
            } else {
                title = 'Allenamento ' + startHour + "-" +
                    endHour + " di " + res['customer']['lastName']
            }
        }
        let isMyEvent = res.user.id == this.user.id;
        let isDeletable = this.current_role_view == 1 || isMyEvent;
        return {
            start: startTime,
            end: endTime,
            title: title,
            color: (isATimeOff) ? colors.red : (res.confirmed) ? colors.blue : colors.yellow,
            actions: isDeletable ? this.actions: [],
            allDay: allDay == (this.dayEndHour - this.dayStartHour),
            resizable: {
                beforeStart: false,
                afterEnd: false
            },
            draggable: false,
            meta: res
        }
    }

    private bookReservation(date: Date) {
        this.loading = true;
        let currentDate = new Date(date);
        let stringDate = BookingComponent.getDateString(currentDate);
        this.trainingService.book(currentDate, this.user.id, (res) => {
            this.loading = false;
            let message = {
                text: "Prenotazione effettuata per il " + stringDate,
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.modal.dismissAll();
            this.events.push(this.formatEvent(res));
            this.refreshView();
        }, (err) => {
            this.modal.dismissAll();
            this.loading = false;
            let message = {
                text: err.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        });

    }

    private bookTimeOff(date: any) {
        this.loading = true;
        let {startTime, endTime} = this.getStartAndEndTimeByGymConfiguration(new Date(date));
        let stringDate = BookingComponent.getDateString(startTime);
        this.timesOffService.book(startTime, endTime, 'admin', this.timeOffName, this.user.id, (res) => {
            this.loading = false;
            let message = {
                text: "Chiusura confermata per il " + stringDate,
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.modal.dismissAll();
            this.events.push(this.formatEvent(res));
            this.refreshView();
            this.timeOffName = "";
        }, (err) => {
            this.modal.dismissAll();
            this.loading = false;
            let message = {
                text: err.message,
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
            this.timeOffName = "";
        });
    }

    private getStartAndEndTimeByView() {
        let startDay;
        let endDay;
        let month = this.viewDate.getMonth();
        let year = this.viewDate.getFullYear();
        let date = this.viewDate.getDate();
        let dayOfWeek = this.viewDate.getDay();
        let hour = 0;
        let min = 0;

        switch (this.view) {
            case CalendarView.Month:
                let nextMonth = month + 1;
                startDay = new Date(year, month, 1, hour, min);
                endDay = new Date(year, nextMonth, 0, hour, min);
                break;
            case CalendarView.Week:
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

    onViewDateChanged(view?: CalendarView) {
        if (view) {
            this.view = view;
        }
        this.activeDayIsOpen = false;
        this.getEvents();
    }

    dayClicked(event): void {
        if (this.viewDate.getTime() === event.day.date.getTime()) {
            if (this.activeDayIsOpen || event.day.events.length == 0) {
                this.view = CalendarView.Day;
                this.activeDayIsOpen = true;
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
        else {
            this.viewDate = event.day.date;
            if (!this.activeDayIsOpen) {
                if (event.day.events.length == 0) {
                    this.view = CalendarView.Day;
                }
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
        }
    }

    dayHeaderClicked(event) : void {
        let action = "hour";
        let role = this.current_role_view;
        let date = event['day']['date'];
        switch (this.current_role_view) {
            case 1:
                this.checkClosable(action, role, date, event);
                break;
            case 2:
                this.checkClosable(action, role, date, event);
                break;
            default:
                break;
        }
    }

    hourSegmentClicked(event: CalendarEvent) : void {
        let action = "hour";
        let role = this.current_role_view;
        let date = event['date'];
        switch(role) {
            case 3:
                this.checkAvailability(action, role, date, event);
                break;
            default:
                break;
        }
    }

    private refreshView() {
        this.refresh.next();
    }

    private static getDateString(currentDate) {
        return currentDate.getDay() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear() + ", "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes();
    }
}
