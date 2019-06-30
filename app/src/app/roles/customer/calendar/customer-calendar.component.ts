import {Component} from '@angular/core';
import {BaseCalendar} from '../../../shared/components/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade, SnackBarService} from '../../../services';
import {concat, Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {CustomerInfoModalComponent} from './customer-info-modal.component';
import {CustomerHourModalComponent} from './customer-hour-modal.component';
import {CustomerDeleteModalComponent} from './customer-delete-modal.component';


@Component({
    templateUrl: './customer-calendar.component.html',
    styleUrls: ['../../../styles/root.css', '../../../styles/calendar.css']
})
export class CustomerCalendarComponent extends BaseCalendar {

    constructor(private dialog: MatDialog,
                private snackBar: SnackBarService,
                public facade: CalendarFacade,
                public router: Router,
                public activatedRoute: ActivatedRoute) {
        super(facade, router, activatedRoute);
    }

    getEvents() {
        this.events = [];

        const {startDay, endDay} = this.getStartAndEndTimeByView();

        const s1 = this.facade.getCustomerEvents(startDay, endDay);

        const s2 = this.facade.getHoliday(startDay, endDay);

        const s3 = this.facade.getCourseEvents(startDay, endDay);


        concat(s1, s2, s3)
            .subscribe(rel => {
                this.events.push(...rel.map(value => this.formatEvent(value)));
                this.refreshView();
            });
    }

    header(action: string, event: any) {
        console.log(action, event);
    }

    hour(action: string, event: any) {
        if (!this.isValidHour(event)) {
            return this.snackBar.open('Orario non valido');
        }

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
            // case 'change':
            //     this.openChangeModal();
            //     break;
            // case 'header':
            //     this.openHeaderModal();
            //     break;
            default:
                console.log(action);
                break;
        }
    }

    private openInfoModal() {
        const dialogRef = this.dialog.open(CustomerInfoModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.facade.createReservationFromEvent(this.modalData.userId, this.modalData.event.meta.id).subscribe((_) => {
                    this.snackBar.open('Prenotazione effettuata');
                    this.getEvents();
                }, err => {
                    if (err.error) {
                        this.snackBar.open(err.error.message);
                    }
                });
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
                    .subscribe(res => {
                        this.snackBar.open('Prenotazione effettuata');
                        this.getEvents();
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
                this.facade.deleteReservation(data)
                    .subscribe(res => {
                        this.snackBar.open('La Prenotazione è stata eliminata');
                        this.getEvents();
                    }, err => {
                        if (err.error) {
                            this.snackBar.open(err.error.message);
                        }
                    });
            }
        });
    }
}
