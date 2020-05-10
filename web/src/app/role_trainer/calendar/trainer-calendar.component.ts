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
import {map, takeUntil} from 'rxjs/operators';
import {forkJoin} from 'rxjs';


@Component({
    templateUrl: '../../shared/calendar/calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css']
})
export class TrainerCalendarComponent extends BaseCalendar {

    constructor(private dateService: DateService,
                public facade: CalendarFacade,
                public snackBar: SnackBarService,
                private dialog: MatDialog,
                public router: Router,
                public screenService: ScreenService,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, snackBar, activatedRoute, screenService);
    }

    getEvents() {
        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const events = [];
        let data = this.facade.getTrainingEvents(startDay, endDay);
        events.push(data);

        data = this.facade.getTimesOff(startDay, endDay, this.user.id);
        events.push(data);

        data = this.facade.getHoliday(startDay, endDay);

        events.push(data);

        forkJoin(events)
            .pipe(
                takeUntil(this.unsubscribe$)
            )
            .subscribe(r => {
                this.events = [];
                r.forEach((o: any[]) => {
                    this.events.push(...o.map(v => this.formatEvent(v)));
                });
                this.refreshView();
            });


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

    hour(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.HOUR,
            title: 'Orario di Ferie',
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
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
                        this.completeEvent(data);
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
                if (data.end) {
                    data.end = this.dateService.addHour(data.start);
                }
                this.createTimeOff(data, data.end);
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
                        this.deleteTimeOff(data);
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
}
