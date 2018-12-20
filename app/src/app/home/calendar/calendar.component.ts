import {Component, OnInit} from "@angular/core";

import {
    CalendarEvent,
    CalendarView,
    DAYS_OF_WEEK
} from "angular-calendar";
import {AppService, DateService, GymConfigurationService} from "../../services";
import {ChangeViewService, NotificationService} from "../../services";

@Component({
    templateUrl: './calendar.component.html',
    styleUrls: ['../../app.component.css']
})
export class CalendarComponent implements OnInit {


    current_role_view: number;
    email: string;

    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;

    dayStartHour: number;
    dayEndHour: number;
    excludeDays: number[];
    weekStartsOn: number;


    constructor(private appService: AppService,
                private messageService: NotificationService,
                private dateService: DateService,
                private gymConf: GymConfigurationService,
                private changeViewService: ChangeViewService) {
        this.current_role_view = this.appService.current_role_view;
        this.email = this.appService.user.email;
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value
        });

    }

    ngOnInit(): void {
        this.dayEndHour = this.gymConf.dayEndHour;
        this.dayStartHour = this.gymConf.dayStartHour;
        this.excludeDays = this.gymConf.excludeDays;
        this.weekStartsOn = this.gymConf.weekStartsOn;
    }

    // private getEvents() : void {
    //     this.events = [];
    //     switch (this.current_role_view) {
    //         case 3:
    //             this.getReservations(this.user.id);
    //             this.timesOff(undefined, "admin");
    //             break;
    //         case 2:
    //             this.getReservations();
    //             this.timesOff(this.user.id);
    //             this.timesOff(undefined, "admin");
    //             break;
    //         case 1:
    //             this.getReservations();
    //             this.timesOff();
    //             break;
    //         default:
    //             break;
    //     }
    // }
    //
    // private checkClosable(action, role, date, event) {
    //
    //     if (date < new Date()) {
    //         return;
    //     }
    //     let title = (role == 1)? "Giorno di chiusura": "Giorno di Ferie";
    //     let type = (role == 1)? "admin" : "trainer";
    //     let {startTime, endTime} = this.getStartAndEndTimeByGymConfiguration(new Date(date));
    //     this.timesOffService.check(startTime, endTime, type, this.user.id,res => {
    //         this.modalData = { action, title, role, event };
    //         this.modalContent.open(this.modalData);
    //     }, err => {
    //         let message = {
    //             text: err.error,
    //             class: "alert-danger"
    //         };
    //         this.notificationService.sendMessage(message);
    //     });
    // }
    //
    // eventTimesChanged({ event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    //     event.start = newStart;
    //     event.end = newEnd;
    //     this.handleEvent('Dropped or resized', event);
    //     this.refresh.next();
    // }
    //
    // onComplete(event: CalendarEvent) {
    //     this.loading = true;
    //     let stringDate = this.dateService.getDate(event.start);
    //     this.trainingService.onComplete(event.meta.id, (res) => {
    //         this.loading = false;
    //         let message = {
    //             text: "Allenamento #" + event.meta.session.id + " completato",
    //             class: "alert-success"
    //         };
    //         this.notificationService.sendMessage(message);
    //         this.modalContent.dismissAll();
    //         this.getEvents();
    //         this.refreshView();
    //     }, (err) => {
    //         this.modalContent.dismissAll();
    //         this.loading = false;
    //         let message = {
    //             text: err.error.message,
    //             class: "alert-danger"
    //         };
    //         this.notificationService.sendMessage(message);
    //     })
    // }

    //
    // private formatEvent(res: any) {
    //     let startTime = new Date(res['startTime']);
    //     let endTime = new Date(res['endTime']);
    //     let allDay = Math.abs(endTime.getTime() - startTime.getTime()) / 36e5 ;
    //     let startHour = startTime.getHours();
    //     let endHour = endTime.getHours();
    //
    //     let title;
    //     let isATimeOff = res.type !== undefined;
    //     if (isATimeOff) {
    //         title = res.name;
    //         res.eventName = (res.type == "admin") ? "chiusura" : "ferie";
    //     }
    //     else {
    //         res.type = "reservation";
    //         res.eventName = "prenotazione";
    //         if (this.current_role_view == 3) {
    //             title = 'Il tuo allenamento dalle ' + startHour + ' alle ' + endHour;
    //         } else {
    //             title = 'Allenamento ' + startHour + "-" +
    //                 endHour + " di " + res['customer']['lastName']
    //         }
    //     }
    //     let isMyEvent = res.user.id == this.user.id;
    //     let isDeletable = this.current_role_view == 1 || isMyEvent;
    //     return {
    //         start: startTime,
    //         end: endTime,
    //         title: title,
    //         color: (isATimeOff) ? colors.red : (res.confirmed) ? colors.BLUE : colors.YELLOW,
    //         actions: isDeletable ? this.actions: [],
    //         allDay: allDay == (this.dayEndHour - this.dayStartHour),
    //         resizable: {
    //             beforeStart: false,
    //             afterEnd: false
    //         },
    //         draggable: false,
    //         meta: res
    //     }
    // }
    //
    // private bookReservation(date: Date) {
    //     this.loading = true;
    //     let currentDate = new Date(date);
    //     let stringDate = this.dateService.getDate(currentDate);
    //     this.trainingService.book(currentDate, this.user.id, (res) => {
    //         this.loading = false;
    //         let message = {
    //             text: "Prenotazione effettuata per il " + stringDate,
    //             class: "alert-success"
    //         };
    //         this.notificationService.sendMessage(message);
    //         this.modalContent.dismissAll();
    //         this.events.push(this.formatEvent(res));
    //         this.refreshView();
    //     }, (err) => {
    //         this.modalContent.dismissAll();
    //         this.loading = false;
    //         let message = {
    //             text: err.message,
    //             class: "alert-danger"
    //         };
    //         this.notificationService.sendMessage(message);
    //     });
    //
    // }

}
