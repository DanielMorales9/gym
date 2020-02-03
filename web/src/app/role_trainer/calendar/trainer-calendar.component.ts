import {Component} from '@angular/core';
import {BaseCalendar} from '../../shared/calendar';
import {EVENT_TYPES} from '../../shared/calendar/event-types.enum';
import {CalendarFacade} from '../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {TrainerInfoModalComponent} from './trainer-info-modal.component';
import {MatDialog} from '@angular/material';
import {TrainerHeaderModalComponent} from './trainer-header-modal.component';
import {TrainerDeleteModalComponent} from './trainer-delete-modal.component';
import {TrainerChangeModalComponent} from './trainer-change-modal.component';
import {TrainerHourModalComponent} from './trainer-hour-modal.component';
import {DateService, ScreenService, SnackBarService} from '../../core/utilities';


@Component({
    templateUrl: '../../shared/calendar/calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css']
})
export class TrainerCalendarComponent extends BaseCalendar {

    constructor(private dateService: DateService,
                public facade: CalendarFacade,
                private snackBar: SnackBarService,
                private dialog: MatDialog,
                public router: Router,
                public screenService: ScreenService,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, activatedRoute, screenService);
    }

    async getEvents() {
        this.events = [];
        const {startDay, endDay} = this.getStartAndEndTimeByView();

        let [data, error] = await this.facade.getTrainingEvents(startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));

        [data, error] = await this.facade.getTimesOff(startDay, endDay, this.user.id);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));

        [data, error] = await this.facade.getHoliday(startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));
        this.refreshView();
    }

    change(action: string, event: any) {
        this.facade.canEdit({startTime: event.newStart, endTime: event.newEnd})
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

    header(action: string, event: any) {
        this.facade.isTimeOffAvailableAllDay(new Date(event.day.date))
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

    async hour(action: string, event: any) {
        this.facade.isTimeOffAvailable(new Date(event.date))
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
                this.createTimeOff(data, end);
            }
        });
    }

    private openDeleteModal() {
        const dialogRef = this.dialog.open(TrainerDeleteModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(async data => {
            if (!!data) {
                switch (data.type) {
                    case 'trainer':
                        await this.deleteTimeOff(data);
                        break;
                    case 'reservation':
                        this.deleteReservation(data);
                        break;
                    case 'course':
                        this.deleteCourseEvent(data);
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
                this.createTimeOff(data);
            }
        });
    }

    private openChangeModal() {
        const dialogRef = this.dialog.open(TrainerChangeModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                this.editTimeOff(data);
            }
        });

    }

    private confirmReservation(data: any) {
        this.facade.confirmReservation(data.eventId)
            .subscribe(async (_) => {
                this.snackBar.open('Prenotazione confermata');
                await this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    private completeReservation(data: any) {
        this.facade.completeEvent(data.eventId)
            .subscribe(async (_) => {
                this.snackBar.open('Allenamento completato');
                await this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private createTimeOff(data: any, end?: Date) {
        this.facade.createTimeOff(data.userId, data.name, data.start, end)
            .subscribe(async (_) => {
                this.snackBar.open('Ferie richieste');
                await this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private async deleteTimeOff(data: any) {
        const [_, error] = await this.facade.deleteTimeOff(data.eventId);
        if (error) {
            this.snackBar.open(error.error.message);
        } else {
            this.snackBar.open('Ferie eliminate con successo');
            await this.getEvents();
        }
    }

    private deleteReservation(data: any) {
        this.facade.deleteReservation(data)
            .subscribe(async _ => {
                this.snackBar.open('Prenotazione è stata eliminata');
                await this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private editTimeOff(data) {
        this.facade.editTimeOff(data.eventId, data.start, data.end, data.eventName)
            .subscribe(async (_) => {
                this.snackBar.open('Ferie richieste');
                await this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    private deleteCourseEvent(data: any) {
        this.facade.deleteCourseEvent(data.eventId).subscribe( async(_) => {
            this.snackBar.open('Evento eliminato');
            await this.getEvents();
        }, (err) => {
            this.snackBar.open(err.error.message);
        });
    }
}
