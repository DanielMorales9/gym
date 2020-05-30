import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {BaseCalendar, CustomerDeleteModalComponent, CustomerHourModalComponent, CustomerInfoModalComponent} from '../../shared/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {MatDialog} from '@angular/material';
import {ScreenService, SnackBarService} from '../../core/utilities';
import {forkJoin} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';


@Component({
    templateUrl: '../../shared/calendar/calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                public snackBar: SnackBarService,
                public facade: CalendarFacade,
                public router: Router,
                public screenService: ScreenService,
                private cdr: ChangeDetectorRef,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, snackBar, activatedRoute, screenService);
    }

    getEvents() {
        this.events = [];

        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const events = [];
        let data = this.facade.getCustomerEvents(this.user.id, startDay, endDay);
        events.push(data);
        data = this.facade.getHoliday(startDay, endDay);
        events.push(data);
        data = this.facade.getCourseEvents(startDay, endDay);
        events.push(data);
        forkJoin(events)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
                this.events = [];
                r.forEach((o: any) => {
                    this.events.push(...o.map(v => this.formatEvent(v)));
                });
                this.refreshView();
                this.cdr.detectChanges();
            });

    }

    header(action: string, event: any) {
    }

    hour(action: string, event: any) {
        this.facade.getCurrentTrainingBundles(this.user.id)
            .subscribe(res => {
                this.user.currentTrainingBundles = res;
                if (!this.user.currentTrainingBundles) {
                    return this.snackBar.open('Non hai pacchetti a disposizione');
                }

                event.bundles = this.user.currentTrainingBundles.filter(v => v.type !== 'C');
                this.modalData = {
                    action: action,
                    title: 'Prenota il tuo allenamento!',
                    userId: this.user.id,
                    role: this.role,
                    event: event
                };
                this.openModal(action);
            });
    }

    change(action: string, event: any) {}

    delete(action: string, event: any) {
        this.modalData = {
            action: action,
            title: `Sei sicuro di voler eliminare la prenotazione?`,
            role: this.role,
            userId: this.user.id,
            event: event
        };
        this.openModal(action);
    }

    info(action: string, event: any) {
        event = event.event;
        this.modalData = {
            action: action,
            title: event.title,
            role: this.role,
            userId: this.user.id,
            event: event
        };
        this.openModal(action);
    }

    openModal(action: string) {
        switch (action) {
            case 'hour':
                this.openHourModal();
                break;
            case 'info':
                this.openInfoModal();
                break;
            case 'delete':
                this.openDeleteModal();
                break;
            default:
                break;
        }
    }

    private openInfoModal() {
        const dialogRef = this.dialog.open(CustomerInfoModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe( data => {
            if (data) {
                if (data.type === 'delete') {
                    this.deleteReservation(data);
                } else {
                    this.createReservation(data);
                }
            }
        });
    }

    private openHourModal() {
        const dialogRef = this.dialog.open(CustomerHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.createReservationFromBundle(data);
            }
        });
    }


    private openDeleteModal() {
        const dialogRef = this.dialog.open(CustomerDeleteModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.deleteReservation(data);
            }
        });
    }
}
