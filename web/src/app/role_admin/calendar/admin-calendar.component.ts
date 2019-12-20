import {Component} from '@angular/core';
import {EVENT_TYPES} from '../../shared/components/calendar/event-types.enum';
import {CalendarFacade} from '../../services';
import {BaseCalendar} from '../../shared/components/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AdminHeaderModalComponent} from './admin-header-modal.component';
import {AdminInfoModalComponent} from './admin-info-modal.component';
import {AdminDeleteModalComponent} from './admin-delete-modal.component';
import {AdminChangeModalComponent} from './admin-change-modal.component';
import {AdminHourModalComponent} from './admin-hour-modal.component';
import {DateService, ScreenService, SnackBarService} from '../../core/utilities';


@Component({
    templateUrl: './admin-calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css']
})
export class AdminCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                private dateService: DateService,
                private snackBar: SnackBarService,
                public facade: CalendarFacade,
                public screenService: ScreenService,
                public router: Router,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, activatedRoute, screenService);
    }

    async getEvents() {
        this.events = [];
        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const [data, error] = await this.facade.getAllEvents(startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));
        this.refreshView();
    }

    header(action: string, event: any) {
        if (this.isValidHeader(event)) {
            this.facade.isHolidayAvailableAllDay(event.day.date)
                .subscribe(_ => {
                    this.modalData = {
                        action: EVENT_TYPES.HEADER,
                        title: 'Giorno di Chiusura',
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

    delete(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.DELETE,
            title: `Sei sicuro di voler eliminare ${event.meta.eventName}?`,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    hour(action: string, event: any) {
        if (!this.isValidHour(event)) {
            return this.snackBar.open('Orario non valido');
        }

        this.facade.getCourses(event.date).subscribe(courses => {
            event.courses = courses;
            this.modalData = {
                action: EVENT_TYPES.HOUR,
                title: 'Crea Evento',
                userId: this.user.id,
                role: this.role,
                event: event
            };
            this.openModal(action);
        }, err => this.snackBar.open(err.error.message));

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
        if (!this.isValidChange(event)) {
            return this.snackBar.open('Orario non valido');
        }
        this.facade.canEdit({startTime: event.newStart, endTime: event.newEnd})
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

        dialogRef.afterClosed().subscribe(async data => {
            if (!!data) {
                await this.createHoliday(data);
            }
        });
    }

    private openHourModal() {
        const dialogRef = this.dialog.open(AdminHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(async data => {
            if (!!data) {
                const end = this.dateService.addHour(data.start);
                if (!!data.meta) {
                    console.log(data);
                    this.createCourseEvent(data, end);
                } else {
                    await this.createHoliday(data, end);
                }
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
                        this.deleteHoliday(data);
                        break;
                    case 'trainer':
                        this.deleteTrainerTimeOff(data);
                        break;
                    case 'reservation':
                        this.deleteReservation(data);
                        break;
                    case 'course':
                        this.deleteCourseEvent(data);
                        break;
                    case 'notAllowed':
                        this.snackBar.open('Non può essere cancellata dall\'admin!');
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
                this.editHoliday(data);
            }
        });
    }

    private editHoliday(data) {
        console.log(data);
        this.facade.editHoliday(data.eventId, {name: data.eventName, startTime: data.start, endTime: data.end})
            .subscribe(async (_) => {
                this.snackBar.open('Chiusura confermata');
                await this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    private deleteReservation(data) {
        this.facade.deleteReservation(data)
            .subscribe(async _ => {
                this.snackBar.open('Prenotazione è stata eliminata');
                await this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private async createHoliday(data, end?) {
        const [_, error] = await this.facade.createHoliday(data.eventName, data.start, end);
        if (error) {
            this.snackBar.open(error.error.message);
        }
        else {
            this.snackBar.open('Chiusura confermata');
            await this.getEvents();
        }
    }

    private async deleteTrainerTimeOff(data) {
        const [_, error] = await this.facade.deleteTimeOff(data.eventId);
        if (error) {
            this.snackBar.open(error.error.message);
        }
        else {
            this.snackBar.open('Ferie cancellate');
            await this.getEvents();
        }
    }

    private deleteHoliday(data) {
        this.facade.deleteHoliday(data.eventId)
            .subscribe(async res => {
                this.snackBar.open('La chiusura è stata eliminata');
                await this.getEvents();
            }, err => {
                this.snackBar.open(err.error.message);
            });
    }

    private completeReservation(data) {
        this.facade.completeEvent(data.eventId)
            .subscribe(async (_) => {
                this.snackBar.open('Allenamento completato');
                await this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
    }

    private confirmReservation(data) {
        this.facade.confirmReservation(data.eventId)
            .subscribe(async (_) => {
                this.snackBar.open('Prenotazione confermata');
                await this.getEvents();
            }, (err) => this.snackBar.open(err.error.message));
    }

    private createCourseEvent(data: any, end: Date) {
        this.facade.createCourseEvent(data.eventName, data.meta, data.start, end)
            .subscribe(async (_) => {
                this.snackBar.open('Evento confermato');
                await this.getEvents();
            }, (err) => {
                this.snackBar.open(err.error.message);
            });
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
