import {Component} from '@angular/core';
import {TrainingService} from '../../../shared/services';
import {BaseCalendar} from '../../../shared/components/calendar';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarFacade, SnackBarService} from '../../../services';
import {concat} from 'rxjs';
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

        const s1 = this.facade.getReservations(startDay, endDay, this.user.id);

        const s2 = this.facade.getTimesOff(startDay, endDay, undefined, 'admin');

        concat(s1, s2)
            .subscribe(rel => {
                this.events.push(...rel.map(value => this.formatEvent(value)));
                this.refreshView();
            });
    }

    header(action: string, event: any) {
        console.log(action, event);
    }

    hour(action: string, event: any) {
        if (event.date >= new Date()) {
            this.facade.checkReservation(event.date, this.user.id)
                .subscribe(_ => {
                    this.modalData = {
                        action: action,
                        title: 'Prenota il tuo allenamento!',
                        userId: this.user.id,
                        role: this.role,
                        event: event
                    };
                    this.openModal(action);
                }, err => { if (err.error) { this.snackBar.open(err.error.message); }});
        }
    }

    change(action: string, event: any) {}

    delete(action: string, event: any) {
        this.modalData = {
            action: action,
            title: `Sei sicuro di voler eliminare la ${event.meta.eventName}?`,
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
    }

    private openHourModal() {
        const dialogRef = this.dialog.open(CustomerHourModalComponent, {
            data: this.modalData
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {

                this.facade.bookReservation(new Date(data.start), data.userId)
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
                this.facade.deleteReservation(data.eventId, data.type)
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

    // TODO Draggable reservation
}
