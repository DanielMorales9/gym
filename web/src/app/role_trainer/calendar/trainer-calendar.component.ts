import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {BaseCalendar} from '../../shared/calendar';
import {EVENT_TYPES} from '../../shared/calendar/event-types.enum';
import {CalendarFacade} from '../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {TrainerInfoModalComponent} from './trainer-info-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {TrainerHeaderModalComponent} from './trainer-header-modal.component';
import {TrainerDeleteModalComponent} from './trainer-delete-modal.component';
import {TrainerChangeModalComponent} from './trainer-change-modal.component';
import {TrainerHourModalComponent} from './trainer-hour-modal.component';
import {DateService, ScreenService, SnackBarService} from '../../core/utilities';
import {takeUntil} from 'rxjs/operators';
import {PolicyService} from '../../core/policy';


@Component({
    templateUrl: '../../shared/calendar/calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainerCalendarComponent extends BaseCalendar {

    constructor(private dateService: DateService,
                public facade: CalendarFacade,
                public snackBar: SnackBarService,
                private dialog: MatDialog,
                public router: Router,
                public screenService: ScreenService,
                public policyService: PolicyService,
                public cdr: ChangeDetectorRef,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, policyService, snackBar, activatedRoute, cdr, screenService);
    }

    getEvents() {
        const {startDay, endDay} = this.getStartAndEndTimeByView();

        this.facade.getEvents(startDay, endDay, this.types, undefined, this.user.id)
            .pipe(
                takeUntil(this.unsubscribe$)
            )
            .subscribe(r => {
                this.events = [];
                this.events.push(...r.map(v => this.formatEvent(v)));
                this.refreshView();
                this.cdr.detectChanges();
            });


    }

    change(action: string, event: any) {
         this.modalData = {
                action: EVENT_TYPES.CHANGE,
                title: 'Orario di Ferie',
                userId: this.user.id,
                role: this.currentRoleId,
                event: event
            };
            this.openModal(action);
    }

    header(action: string, event: any) {
        this.modalData = {
                action: EVENT_TYPES.HEADER,
                title: 'Giorno di Ferie',
                userId: this.user.id,
                role: this.currentRoleId,
                event: event
        };
        this.openModal(action);
    }

    delete(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.DELETE,
            title: `Sei sicuro di voler eliminare la ${event.meta.eventName} ?`,
            userId: this.user.id,
            role: this.currentRoleId,
            event: event
        };
        this.openModal(action);
    }

    hour(action: string, event: any) {
        this.modalData = {
            action: EVENT_TYPES.HOUR,
            title: 'Orario di Ferie',
            userId: this.user.id,
            role: this.currentRoleId,
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
            role: this.currentRoleId,
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
