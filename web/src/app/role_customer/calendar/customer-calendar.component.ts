import {Component} from '@angular/core';
import {
    BaseCalendar,
    CustomerDeleteModalComponent,
    CustomerHourModalComponent,
    CustomerInfoModalComponent
} from '../../shared/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {MatDialog} from '@angular/material';
import {ScreenService, SnackBarService} from '../../core/utilities';


@Component({
    templateUrl: '../../shared/calendar/calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css']
})
export class CustomerCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                private snackBar: SnackBarService,
                public facade: CalendarFacade,
                public router: Router,
                public screenService: ScreenService,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, activatedRoute, screenService);
    }

    async getEvents() {
        this.events = [];

        const {startDay, endDay} = this.getStartAndEndTimeByView();

        let [data, error] = await this.facade.getCustomerEvents(this.user.id, startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));

        [data, error] = await this.facade.getHoliday(startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));

        [data, error] = await this.facade.getCourseEvents(startDay, endDay);
        if (error) {
            throw error;
        }
        this.events.push(...data.map(value => this.formatEvent(value)));
        this.refreshView();
    }

    header(action: string, event: any) {
    }

    async hour(action: string, event: any) {
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

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                if (data.type === 'delete') {
                    this.deleteReservation(data);
                } else {
                    this.createReservation(data);
                }
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
                    this.snackBar.open(err.error.message);
                }
            });
    }
}
