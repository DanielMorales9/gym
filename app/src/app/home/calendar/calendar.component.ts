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
    // private timesOff(id?: number, type?: string) {
    //     let {startDay, endDay} = this.getStartAndEndTimeByView();
    //     this.timesOffService.getTimesOff(startDay, endDay, res => {
    //         res.map(res => {
    //             this.events.push(this.formatEvent(res))
    //         });
    //         this.refreshView();
    //     }, undefined, id, type);
    // }
    //
    // private getReservations(id?: number) {
    //     let {startDay, endDay} = this.getStartAndEndTimeByView();
    //     this.trainingService.getReservations(startDay, res => {
    //         console.log(res);
    //         res.forEach(res => {
    //             this.events.push(this.formatEvent(res))
    //         });
    //         this.refreshView();
    //     }, err => {
    //     }, id, endDay);
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

    //
    // private defaultError() {
    //     return err => {
    //         let message = {
    //             text: err.error,
    //             class: "alert-danger"
    //         };
    //         this.notificationService.sendMessage(message);
    //     }
    // }
    //
    // beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    //     body.forEach(cell => {
    //         const groups: any = {};
    //         cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
    //             groups[event.meta.type] = groups[event.meta.type] || [];
    //             groups[event.meta.type].push(event);
    //         });
    //         cell['eventGroups'] = Object.entries(groups);
    //     });
    // }
    //
    // book(data) {
    //     switch(data.role) {
    //         case 1:
    //             this.bookTimeOff(data.event.DAY.date);
    //             break;
    //         case 3:
    //             this.bookReservation(data.event.date);
    //             break;
    //         default:
    //             break;
    //     }
    // }
    //
    // eventTimesChanged({ event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    //     event.start = newStart;
    //     event.end = newEnd;
    //     this.handleEvent('Dropped or resized', event);
    //     this.refresh.next();
    // }
    //
    // handleEvent(action: string, event: CalendarEvent): void {
    //     let role = this.current_role_view;
    //     let title;
    //     console.log(action, event);
    //     switch (action) {
    //         case 'delete':
    //             title = "Sei sicuro di voler eliminare la " + event.meta.eventName + " ?";
    //             break;
    //         case 'info':
    //             title = event.title;
    //             break;
    //         default:
    //             break;
    //     }
    //
    //     this.modalData = { action, title, role, event};
    //     this.modalContent.open(this.modalData);
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
    //
    // delete(modalData) {
    //     switch (modalData.event.meta.type) {
    //         case "reservation":
    //             this.deleteReservation(modalData);
    //             break;
    //         case "admin":
    //             this.deleteTimeOff(modalData);
    //             break;
    //         case "trainer":
    //             break;
    //         default:
    //             break;
    //     }
    // }
    //
    //

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
    //


    //
    // dayHeaderClicked(event) : void {
    //     let action = "hour";
    //     let role = this.current_role_view;
    //     let date = event['DAY']['date'];
    //     switch (this.current_role_view) {
    //         case 1:
    //             this.checkClosable(action, role, date, event);
    //             break;
    //         case 2:
    //             this.checkClosable(action, role, date, event);
    //             break;
    //         default:
    //             break;
    //     }
    // }
    //

}
