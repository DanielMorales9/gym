import {Component} from '@angular/core';
import {BaseCalendar} from '../../../shared/components/calendar';
import {EVENT_TYPES} from '../../../shared/components/calendar/event-types.enum';
import {CalendarFacade, DateService, SnackBarService} from '../../../services';
import {ActivatedRoute} from '@angular/router';
import {concat} from 'rxjs';
import {TrainerInfoModalComponent} from './trainer-info-modal.component';
import {MatDialog} from '@angular/material';
import {TrainerHeaderModalComponent} from './trainer-header-modal.component';
import {TrainerDeleteModalComponent} from './trainer-delete-modal.component';
import {TrainerChangeModalComponent} from './trainer-change-modal.component';
import {TrainerHourModalComponent} from './trainer-hour-modal.component';


@Component({
    selector: 'trainer-calendar',
    templateUrl: './trainer-calendar.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/calendar.css']
})
export class TrainerCalendarComponent extends BaseCalendar {

    constructor(private dateService: DateService,
                public facade: CalendarFacade,
                private snackBar: SnackBarService,
                private dialog: MatDialog,
                public activatedRoute: ActivatedRoute) {
        super(facade, activatedRoute);
    }

    getEvents() {
        this.events = [];
        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const s1 = this.facade.getReservations(startDay, endDay);

        const s2 = this.facade.getTimesOff(startDay, endDay, undefined, 'admin');

        const s3 = this.facade.getTimesOff(startDay, endDay, this.user.id);

        concat(s1, s2, s3)
            .subscribe(rel => {
                this.events.push(...rel.map(value => this.formatEvent(value)));
                this.refreshView();
            });
    }

    change(action: string, event: any) {
        if (event.newStart >= new Date()) {
            const type = 'trainer';
            this.facade.checkTimeOffChange(event.newStart, event.newEnd, type)
                .subscribe(_ => {
                    this.modalData = {
                        action: EVENT_TYPES.CHANGE,
                        title: 'Orario di Ferie',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal(action);
                }, err => {
                    this.snackBar.open(err.error.message);
                });
        }
    }

    header(action: string, event: any) {
        if (event.day.date >= new Date()) {
            this.facade.checkDayTimeOff(new Date(event.day.date), 'trainer')
                .subscribe(res => {
                this.modalData = {
                    action: EVENT_TYPES.HEADER,
                    title: 'Giorno di Ferie',
                    userId: this.user.id,
                    role: this.role,
                    event: event
                };
                this.openModal(action);
            }, err => {
                this.snackBar.open(err.error.message);
            });
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
        console.log(event);
        if (event.date >= new Date()) {
            this.facade.checkHourTimeOff(new Date(event.date), 'trainer')
                .subscribe(res => {
                    this.modalData = {
                        action: EVENT_TYPES.HOUR,
                        title: 'Orario di Ferie',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal(action);
                }, err => {
                    this.snackBar.open(err.error.message);
                });
        }    }

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

    openModal(action: string) {
        switch (action) {
            case 'info':
                this.openInfoModal();
                break;
            case 'hour':
                this.openHourModal();
                break;
            case 'delete':
                this.openDeleteModal();
                break;
            case 'change':
                this.openChangeModal();
                break;
            case 'header':
                this.openHeaderModal();
                break;
            default:
                console.log(action);
                break;
        }
    }


    private openInfoModal() {
        const dialogRef = this.dialog.open(TrainerInfoModalComponent, {
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

    private openHourModal() {
        const dialogRef = this.dialog.open(TrainerHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                const end = this.dateService.addHour(data.start);
                this.bookTimeOff(data, end);
            }
        });
    }

    private openDeleteModal() {
        const dialogRef = this.dialog.open(TrainerDeleteModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                switch (data.type) {
                    case 'trainer':
                        this.deleteTrainerTimeOff(data);
                        break;
                    case 'reservation':
                        this.deleteReservation(data);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    private openHeaderModal() {
        const dialogRef = this.dialog.open(TrainerHeaderModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                this.bookTimeOff(data);
            }
        });
    }

    private openChangeModal() {
        const dialogRef = this.dialog.open(TrainerChangeModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                this.changeTimeOff(data);
            }
        });

    }

    private confirmReservation(data: any) {
        this.facade.confirmReservation(data.eventId)
            .subscribe((_) => {
                this.snackBar.open('Prenotazione confermata');
                this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    private completeReservation(data: any) {
        this.facade.completeReservation(data.eventId)
            .subscribe((_) => {
                this.snackBar.open('Allenamento completato');
                this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private bookTimeOff(data: any, end?: Date) {
        this.facade.bookTimeOff(data.start, data.name, data.type, data.userId, end)
            .subscribe((_) => {
                this.snackBar.open('Ferie richieste');
                this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private deleteTrainerTimeOff(data: any) {
        this.facade.deleteTimeOff(data.eventId)
            .subscribe(res => {
                this.snackBar.open('Ferie eliminate con successo');
                this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);

            });
    }

    private deleteReservation(data: any) {
        this.facade.deleteReservation(data.eventId, 'trainer')
            .subscribe(_ => {
                this.snackBar.open('Prenotazione è stata eliminata');
                this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private changeTimeOff(data) {
        this.facade.changeTimeOff(data.eventId, data.start, data.end, data.eventName, data.type)
            .subscribe((_) => {
                this.snackBar.open('Ferie richieste');
                this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }
}
