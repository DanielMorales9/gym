import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {EVENT_TYPES} from '../../shared/calendar/event-types.enum';
import {CalendarFacade} from '../../services';
import {BaseCalendar} from '../../shared/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AdminHeaderModalComponent} from './admin-header-modal.component';
import {AdminInfoModalComponent} from './admin-info-modal.component';
import {AdminDeleteModalComponent} from './admin-delete-modal.component';
import {AdminChangeModalComponent} from './admin-change-modal.component';
import {AdminHourModalComponent} from './admin-hour-modal.component';
import {DateService, ScreenService, SnackBarService} from '../../core/utilities';
import {filter, map, takeUntil} from 'rxjs/operators';
import {PolicyService} from '../../core/policy';


@Component({
    templateUrl: '../../shared/calendar/calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCalendarComponent extends BaseCalendar {


    constructor(private dialog: MatDialog,
                private dateService: DateService,
                public snackBar: SnackBarService,
                public facade: CalendarFacade,
                public screenService: ScreenService,
                public router: Router,
                public policyService: PolicyService,
                public cdr: ChangeDetectorRef,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, policyService, snackBar, activatedRoute, cdr, screenService);
    }

    getEvents() {
        const {startDay, endDay} = this.getStartAndEndTimeByView();
        this.facade.getEvents(startDay, endDay, this.types)
            .pipe(
                takeUntil(this.unsubscribe$),
                map(r => r.map(v => this.formatEvent(v)))
            )
            .subscribe(r => {
                this.events = r;
                this.refreshView();
                this.cdr.detectChanges();
            });
    }

    header(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.HEADER,
            title: 'Giorno di Chiusura',
            userId: this.user.id,
            role: this.currentRoleId,
            event: event
        };
        this.openModal(action);
    }

    delete(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.DELETE,
            title: `Sei sicuro di voler eliminare ${event.meta.eventName}?`,
            userId: this.user.id,
            role: this.currentRoleId,
            event: event
        };
        this.openModal(action);
    }

    hour(action: string, event: any) {
        this.facade.getCourses()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                event.courses = data;
                this.modalData = {
                    action: EVENT_TYPES.HOUR,
                    title: 'Crea Evento',
                    userId: this.user.id,
                    role: this.currentRoleId,
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
            role: this.currentRoleId,
            event: event
        };
        this.openModal(action);
    }

    change(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.CHANGE,
            title: 'Cambia chiusura',
            userId: this.user.id,
            role: this.currentRoleId,
            event: event
        };
        this.openModal(action);
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
                break;
        }
    }

    private openHeaderModal() {
        const dialogRef = this.dialog.open(AdminHeaderModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed()
            .pipe(
                filter(data => !!data)
            ).subscribe(r => this.createHoliday(r));
    }

    private openHourModal() {
        const dialogRef = this.dialog.open(AdminHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (!!data) {
                if (!data.end) {
                    data.end = this.dateService.addHour(data.start);
                }
                if (!!data.meta) {
                    this.createCourseEvent(data);
                } else {
                    this.createHoliday(data);
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
                        this.completeEvent(data);
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
                        this.deleteTimeOff(data);
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
}
