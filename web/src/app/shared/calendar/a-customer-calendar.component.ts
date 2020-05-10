import {Component} from '@angular/core';
import {BaseCalendar} from './base-calendar';
import {CustomerDeleteModalComponent} from './customer-delete-modal.component';
import {CustomerHourModalComponent} from './customer-hour-modal.component';
import {CustomerInfoModalComponent} from './customer-info-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {MatDialog} from '@angular/material';
import {ScreenService, SnackBarService} from '../../core/utilities';
import {catchError, first, map, switchMap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
    templateUrl: './calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css']
})
export class ACustomerCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                public snackBar: SnackBarService,
                public facade: CalendarFacade,
                public router: Router,
                public screenService: ScreenService,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, snackBar, activatedRoute, screenService);
    }

    async getEvents() {
        this.events = [];

        const {startDay, endDay} = this.getStartAndEndTimeByView();

        let [data, error] = await this.facade.getCustomerEvents(this.user.id, startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value, false)));

        [data, error] = await this.facade.getCourseEvents(startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value, false)));
        this.refreshView();
    }

    async getUser() {
         await this.activatedRoute.params.pipe(
             first(),
             switchMap(params => this.facade.findUserById(+params['id'])),
             catchError(r => throwError(r)),
             map(r => this.user = r)
         ).toPromise();
    }

    async getRole() {
        this.role = this.facade.getRoleByUser(this.user);
    }

    header(action: string, event: any) {
    }

    async hour(action: string, event: any) {
        const d = await this.facade.getCurrentTrainingBundles(this.user.id).toPromise();
        this.user.currentTrainingBundles = d;

        if (!this.user.currentTrainingBundles) {
            return this.snackBar.open(`Il cliente ${this.user.firstName} ${this.user.lastName} ha pacchetti a disposizione`);
        }

        event.bundles = this.user.currentTrainingBundles.filter(v => v.type !== 'C');
        event.user = this.user;
        this.modalData = {
            action: action,
            title: `Prenota l\'allenamento per ${this.user.firstName} ${this.user.lastName}!`,
            userId: this.user.id,
            role: this.role,
            event: event
        };
        this.openModal(action);
    }

    change(action: string, event: any) {}

    delete(action: string, event: any) {
        event.user = this.user;
        this.modalData = {
            action: action,
            title: `Sei sicuro di voler eliminare la prenotazione per ${this.user.firstName} ${this.user.lastName}?`,
            role: this.role,
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
        this.modalData.confirm = true;
        this.modalData.complete = true;
        const dialogRef = this.dialog.open(CustomerInfoModalComponent, {
            data: this.modalData,
        });

        dialogRef.afterClosed().subscribe(async data => {
            if (data) {
                if (data.type === 'confirm') { this.confirmReservation(data); }
                else if (data.type === 'complete') { await this.completeReservation(data); }
                else if (data.type === 'delete') { this.deleteReservation(data); }
                else { this.createReservation(data); }
            }
        });
    }

    private async createReservation(d) {
        const userId = d.userId;
        const specId = d.event.meta.specification.id;
        let [data, error] = await this.facade.getUserBundleBySpecId(userId, specId);
        if (error) {
            throw error;
        }
        if (data.length === 0) {
            this.snackBar.open('Non possiedi questo pacchetto');
            return;
        }
        const bundleId = data[0].id;
        [data, error] = await this.facade.createReservationFromEvent(d.userId, d.event.meta.id, bundleId);
        if (error) {
            this.snackBar.open(error.error.message);
            return;
        }
        this.snackBar.open('Prenotazione effettuata');
        await this.getEvents();
    }

    private openHourModal() {
        const dialogRef = this.dialog.open(CustomerHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {

                this.facade.createReservationFromBundle(data.userId, data.bundleId,
                    { startTime: data.startTime, endTime: data.endTime })
                    .subscribe(async res => {
                        this.snackBar.open('Prenotazione effettuata');
                        await this.getEvents();
                    }, err => {
                        if (err.error) {
                            this.snackBar.open(err.error.message);
                        }
                    });
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

    private deleteReservation(data) {
        this.facade.deleteReservation(data, this.user.id)
            .subscribe(async res => {
                this.snackBar.open('La Prenotazione è stata eliminata');
                await this.getEvents();
            }, err => {
                if (err.error) {
                    this.snackBar.open(err.error.message, undefined, {duration: 5000});
                }
            });
    }

    private async completeReservation(data) {
        const [_, err] = await this.facade.completeEvent(data.eventId);
        if (err) {
            this.snackBar.open(err.error.message);
            return;
        }
        this.snackBar.open('Allenamento completato');
        await this.getEvents();
    }


}
