import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {BaseCalendar} from './base-calendar';
import {CustomerDeleteModalComponent} from './customer-delete-modal.component';
import {CustomerHourModalComponent} from './customer-hour-modal.component';
import {CustomerInfoModalComponent} from './customer-info-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {MatDialog} from '@angular/material';
import {ScreenService, SnackBarService} from '../../core/utilities';
import {catchError, filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {forkJoin, of, throwError} from 'rxjs';
import {PolicyService} from '../../core/policy';

@Component({
    templateUrl: './calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ACustomerCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                public snackBar: SnackBarService,
                public facade: CalendarFacade,
                public router: Router,
                public screenService: ScreenService,
                public policyService: PolicyService,
                public cdr: ChangeDetectorRef,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, policyService, snackBar, activatedRoute, cdr, screenService);
    }

    getEvents() {
        this.events = [];

        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const events = [];
        let obs;
        if (!!this.user) {
            obs = this.getUserFromRouteParams();
        }
        else {
            obs = of(this.user);
        }

        obs.pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => {
                this.facade.getEvents(startDay, endDay, this.types, user.id)
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe(r => {
                        this.events = [];
                        this.events.push(...r.map(v => this.formatEvent(v)));
                        this.refreshView();
                        this.cdr.detectChanges();
                    });
            });
    }

    private getUserFromRouteParams() {
        return this.activatedRoute.params.pipe(
            filter(params => 'id' in params),
            switchMap(params => this.facade.findUserById(+params['id'])),
            catchError(r => throwError(r)),
            map(r => {
                this.user = r;
                return r;
            }),
            map(r => {
                this.currentRoleId = this.facade.getRoleByUser(r);
                return r;
            })
        );
    }

    header(action: string, event: any) {
    }

    hour(action: string, event: any) {
        this.facade.getCurrentTrainingBundles(this.user.id).subscribe( res => {
            this.user.currentTrainingBundles = res;
            if (!this.user.currentTrainingBundles) {
                return this.snackBar.open(`Il cliente ${this.user.firstName} ${this.user.lastName} non ha pacchetti a disposizione`);
            }

            event.bundles = this.user.currentTrainingBundles.filter(v => v.type !== 'C');
            event.user = this.user;
            this.modalData = {
                action: action,
                title: `Prenota l\'allenamento per ${this.user.firstName} ${this.user.lastName}!`,
                userId: this.user.id,
                role: this.currentRoleId,
                event: event
            };
            this.openModal(action);
        });
    }

    change(action: string, event: any) {}

    delete(action: string, event: any) {
        event.user = this.user;
        this.modalData = {
            action: action,
            title: `Sei sicuro di voler eliminare la prenotazione per ${this.user.firstName} ${this.user.lastName}?`,
            role: this.currentRoleId,
            userId: this.user.id,
            event: event
        };
        this.openModal(action);
    }

    info(action: string, event: any) {
        event = event.event;
        event.user = this.user;
        this.modalData = {
            action: action,
            title: event.title,
            role: this.currentRoleId,
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
        this.modalData.confirm = true;
        this.modalData.complete = true;
        const dialogRef = this.dialog.open(CustomerInfoModalComponent, {
            data: this.modalData,
        });

        dialogRef.afterClosed().subscribe( data => {
            if (data) {
                if (data.type === 'confirm') { this.confirmReservation(data); }
                else if (data.type === 'complete') { this.completeEvent(data); }
                else if (data.type === 'delete') { this.deleteReservation(data); }
                else { this.createReservation(data); }
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
