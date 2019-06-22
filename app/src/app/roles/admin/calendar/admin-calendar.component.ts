import {Component} from '@angular/core';
import {EVENT_TYPES} from '../../../shared/components/calendar/event-types.enum';
import {CalendarFacade, DateService, SnackBarService} from '../../../services';
import {BaseCalendar} from '../../../shared/components/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AdminHeaderModalComponent} from './admin-header-modal.component';
import {AdminInfoModalComponent} from './admin-info-modal.component';
import {concat} from 'rxjs/internal/observable/concat';
import {AdminDeleteModalComponent} from './admin-delete-modal.component';
import {AdminChangeModalComponent} from './admin-change-modal.component';
import {AdminHourModalComponent} from './admin-hour-modal.component';


@Component({
    templateUrl: './admin-calendar.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/calendar.css']
})
export class AdminCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                private dateService: DateService,
                private snackBar: SnackBarService,
                public facade: CalendarFacade,
                public router: Router,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, activatedRoute);
    }

    getEvents() {
        this.events = [];
        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const s1 = this.facade.getReservations(startDay, endDay);

        const s2 = this.facade.getAllEvents(startDay, endDay);

        // const s3 = this.facade.getTimesOff(startDay, endDay, undefined, 'trainer');

        concat(s1, s2)
            .subscribe(rel  => {
                this.events.push(...rel.map(value => this.formatEvent(value)));
                this.refreshView();
            });
    }

    header(action: string, event: any) {
        if (this.isValidHeader(event)) {
            this.facade.checkDayTimeOff(event.day.date, 'admin')
                .subscribe(_ => {
                    this.modalData = {
                        action: EVENT_TYPES.HEADER,
                        title: 'Giorno di Chiusura',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal('header');
                }, err => this.snackBar.open(err.error.message));
        } else {
            this.snackBar.open('Orario non valido');
        }
    }

    delete(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.DELETE,
            title: `Sei sicuro di voler eliminare la ${event.meta.eventName} ?`,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    hour(action: string, event: any) {
        if (this.isValidHour(event)) {
            console.log(event);
            this.facade.checkHourTimeOff(event.date, 'admin')
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.HOUR,
                        title: 'Ora di Chiusura',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal('hour');
                }, err => this.snackBar.open(err.error.message));
        } else {
            this.snackBar.open('Orario non valido');
        }
    }

    info(action: string, event: any) {
        event = event.event;
        this.modalData = {
            action: EVENT_TYPES.INFO,
            title: event.title,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    change(action: string, event: any) {
        if (this.isValidChange(event)) {
            this.facade.checkTimeOffChange(event.newStart, event.newEnd, 'admin')
                .subscribe(_ => {
                    this.modalData = {
                        action: EVENT_TYPES.CHANGE,
                        title: 'Cambia chiusura',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal(action);
                }, err => this.snackBar.open(err.error.message));
        } else {
            this.snackBar.open('Orario non valido');
        }
    }

    openModal(action: string) {
        switch (action) {
            case 'header':
                this.openHeaderModal();
                break;
            case 'hour':
                this.openHourModal();
                break;
            case 'info':
                this.openInfoModal();
                break;
            case 'delete':
                this.openDeleteModal();
                break;
            case 'change':
                this.openChangeModal();
                break;
            default:
                console.log(action);
                break;
        }
    }

    private openHeaderModal() {
        const dialogRef = this.dialog.open(AdminHeaderModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                this.bookTimeOff(data);
            }
        });
    }

    private openHourModal() {
        const dialogRef = this.dialog.open(AdminHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                const end = this.dateService.addHour(data.start);
                this.bookTimeOff(data, end);
            }
        });
    }

    private openInfoModal() {
        const dialogRef = this.dialog.open(AdminInfoModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                switch (data.type) {
                    case 'confirm':
                        this.confirmReservation(data);
                        break;
                    case 'complete':
                        this.completeReservation(data);
                        break;
                    case 'none':
                        return;
                }
            }
        });
    }

    private openDeleteModal() {
        const dialogRef = this.dialog.open(AdminDeleteModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                switch (data.type) {
                    case 'admin':
                        this.deleteAdminTimeOff(data);
                        break;
                    case 'trainer':
                        this.deleteTrainerTimeOff(data);
                        break;
                    case 'reservation':
                        this.deleteReservation(data);
                        break;
                    case 'notAllowed':
                        this.snackBar.open(data.message);
                        break;
                }
            }
        });
    }

    private openChangeModal() {
        const dialogRef = this.dialog.open(AdminChangeModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                this.changeTimeOff(data);
            }
        });
    }

    private changeTimeOff(data) {
        this.facade.changeTimeOff(data.eventId, data.start, data.end, data.eventName, 'admin')
            .subscribe((_) => {
                this.snackBar.open('Chiusura confermata');
                this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    private deleteReservation(data) {
        this.facade.deleteReservation(data.eventId, 'admin')
            .subscribe(_ => {
                this.snackBar.open('Prenotazione è stata eliminata');
                this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private bookTimeOff(data, end?: Date) {
        this.facade.bookTimeOff(data.start, data.eventName, data.type, data.userId, end)
            .subscribe((_) => {
                this.snackBar.open('Chiusura confermata');
                this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private deleteTrainerTimeOff(data) {
        this.facade.deleteTimeOff(data.eventId, 'trainer')
            .subscribe(res => {
                this.snackBar.open('Ferie cancellate');
                this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private deleteAdminTimeOff(data) {
        this.facade.deleteTimeOff(data.eventId)
            .subscribe(res => {
                this.snackBar.open('La chiusura è stata eliminata');
                this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private completeReservation(data) {
        this.facade.completeReservation(data.eventId)
            .subscribe((_) => {
                this.snackBar.open('Allenamento completato');
                this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private confirmReservation(data) {
        this.facade.confirmReservation(data.eventId)
            .subscribe((_) => {
                this.snackBar.open('Prenotazione confermata');
                this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }
}
