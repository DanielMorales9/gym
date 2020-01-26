import {Component} from '@angular/core';
import {BaseCalendar, CustomerInfoModalComponent} from '../../shared/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade} from '../../services';
import {MatDialog} from '@angular/material';
import {CustomerHourModalComponent, CustomerDeleteModalComponent} from '../../shared/calendar';
import {ScreenService, SnackBarService} from '../../core/utilities';
import {first} from 'rxjs/operators';

@Component({
    templateUrl: './a-customer-calendar.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/calendar.css']
})
export class ACustomerCalendarComponent extends BaseCalendar {

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
        this.events.push(...data.map(value => this.formatEvent(value, false)));

        [data, error] = await this.facade.getHoliday(startDay, endDay);
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
        const params = await this.activatedRoute.params.pipe(first()).toPromise();
        const id = +params['id'];
        const [data, error] = await this.facade.findUserById(id);
        if (error) {
            throw error;
        }
        else {
            this.user = data;
        }
    }

    async getRole() {
        this.role = this.facade.getRoleByUser(this.user);
    }

    header(action: string, event: any) {
        console.log(action, event);
    }

    async hour(action: string, event: any) {
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
                console.log(action);
                break;
        }
    }

    private openInfoModal() {
        this.modalData.confirm = true;
        this.modalData.complete = true;
        console.log(this.modalData);
        const dialogRef = this.dialog.open(CustomerInfoModalComponent, {
            data: this.modalData,
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                if (data.type === 'confirm') { this.confirmReservation(data); }
                else if (data.type === 'complete') { this.completeReservation(data); }
                else if (data.type === 'delete') { this.deleteReservation(data); }
                else { this.createReservation(data); }
            }
        });
    }

    private async createReservation(d) {
        const userId = d.userId;
        const specId = d.event.meta.specification.id;
        const [data, error] = await this.facade.getUserBundleBySpecId(userId, specId);
        if (error) {
            throw error;
        }

        const bundleId = data[0].id;
        this.facade.createReservationFromEvent(d.userId, d.event.meta.id, bundleId).subscribe(async (_) => {
            this.snackBar.open('Prenotazione effettuata');
            await this.getEvents();
        }, err => {
            if (err) {
                this.snackBar.open(err.error.message);
            }
        });
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
                console.log(data);
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
}
