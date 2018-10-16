import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {AppService} from "../services/app.service";
import {ChangeViewService} from "../services/change-view.service";
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
    DAYS_OF_WEEK
} from "angular-calendar";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {TrainingService} from "../services/training.service";
import {User} from "../users/user.interface";
import {MessageService} from "../services/message.service";

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
    styleUrls: ['../app.component.css']
})
export class BookingComponent implements OnInit {

    current_role_view: number;

    @ViewChild('modalContent')
    modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    user: User;

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

    constructor(private app: AppService,
                private modal: NgbModal,
                private messageService: MessageService,
                private changeViewService: ChangeViewService,
                private trainingService: TrainingService) {
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value);
        this.loading = false;
    }

    ngOnInit(): void {
        this.app.getFullUser(res => {
            this.user = res;
            this.getReservationEvents();
        }, this.app._systemError());
    }

    private getReservationEvents() : void {
        switch (this.current_role_view) {
            case 3:
                this.getReservations(this.user.id);
                break;
            default:
                this.getReservations();
                break;
        }

        this.events = [];
    }

    private getReservations(id?: number) {
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
                endDay = new Date(year, month, date, hour+24, min);
                break;
        }
        this.trainingService.getReservations(startDay, res => {
            this.events = res.map(res => {
                return this.getEvent(res)
            });
            this.refreshView();
        }, err => {
        }, id, endDay);
    }


    dayClicked(event): void {
        if (this.viewDate != event.day.date && this.activeDayIsOpen && event.day.events.length > 0) {
            this.viewDate = event.day.date;
        }
        else {
            this.viewDate = event.day.date;
            if (event.day.events.length == 0 || this.activeDayIsOpen) {
                this.view = CalendarView.Day;
            }
            this.activeDayIsOpen = !this.activeDayIsOpen;
            if (this.view == CalendarView.Day) {
                this.activeDayIsOpen = false;
            }
        }
    }

    hourSegmentClicked(event: CalendarEvent) {
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

    private checkAvailability(action, role, date, event) {
        if (date < (new Date())) {
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

    book(date) {
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
            this.events.push(this.getEvent(res));
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

    eventTimesChanged({ event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        let role = this.current_role_view;
        let title;
        switch (action) {
            case 'delete':
                title = "Sei sicuro di voler eliminare la prenotazione?";
                break;
            case 'info':
                console.log(action, event);
                title = event.title;
                break;
            default:
                console.log(action, event);
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
            this.getReservationEvents();
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
            this.getReservationEvents();
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

    delete(event) {
        this.loading = true;
        this.trainingService.delete(event.meta.id, res => {
            this.loading = false;
            let that = this;
            setTimeout(function() {
                that.getReservationEvents();
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

    private getEvent(res: any) {
        let title;
        let startTime = new Date(res['startTime']);
        let endTime = new Date(res['endTime']);
        let startHour = startTime.getHours();
        let endHour = endTime.getHours();
        if (this.current_role_view == 3) {
            title = 'Il tuo allenamento dalle ' + startHour + ' alle ' + endHour;
        } else {
            title = 'Allenamento ' + startHour + "-" +
                endHour + " di " + res['customer']['lastName']
        }
        return {
            start: startTime,
            end: endTime,
            title: title,
            color: (res.confirmed) ? colors.blue : colors.yellow,
            actions: this.actions,
            allDay: false,
            resizable: {
                beforeStart: false,
                afterEnd: false
            },
            draggable: false,
            meta: res
        }
    }

    private refreshView() {
        this.refresh.next();
    }

    onViewDateChanged(view?: CalendarView) {
        if (view) {
            this.view = view;
        }
        this.activeDayIsOpen = false;
        this.getReservationEvents();
    }

    private static getDateString(currentDate) {
        return currentDate.getDay() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear() + ", "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes();
    }
}