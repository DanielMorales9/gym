import {Component, OnInit} from '@angular/core';
import {CalendarFacade} from '../../core/facades';
import {ActivatedRoute, Router} from '@angular/router';
import {PolicyService} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {MatDialog} from '@angular/material/dialog';
import {ReservationModalComponent} from './reservation.modal.component';
import {AuthenticationService} from '../../core/authentication';

@Component({
    templateUrl: './event-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
})
export class EventDetailsComponent implements OnInit {

    event: any;
    users: any;
    userSelected = new Map<number, boolean>();
    userReservation = new Map<number, number>();
    userBundle = new Map<number, any>();

    EVENT_TYPES = {
        P: 'Allenamento Personale',
        C: 'Corso',
        H: 'Chiusura',
        T: 'Ferie',
    };

    EVENT_ENTITY = {
        P: 'personal',
        C: 'course',
        H: 'holiday',
        T: 'timeOff',
    };

    displayedPaymentsColumns: any;
    canConfirm: boolean;
    canDelete: boolean;
    canDeleteEvent: boolean;
    canCompleteEvent: boolean;
    canBook: boolean;
    canBookAll: boolean;

    constructor(private facade: CalendarFacade,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private router: Router,
                private auth: AuthenticationService,
                private snackBar: SnackBarService,
                private policy: PolicyService) {
    }

    async ngOnInit(): Promise<void> {
        const id = +this.route.snapshot.params['id'];
        await this.findById(id);
        this.getPolicy();

        const displayedPaymentsColumns = ['index', 'confirmed', 'customer'];
        if (this.canDelete) {
            displayedPaymentsColumns.push('actions');
        }

        this.displayedPaymentsColumns = displayedPaymentsColumns;

        if (this.event.type === 'C') {
            await this.computeMaps(id);
        }
    }

    private async computeMaps(id: number) {
        const [data, error] = await this.facade.getUsersByEventId(id);
        if (error) {
            return;
        }
        this.event.reservations.forEach(v => {
            this.userReservation[v.user.id] = v.id;
            this.userSelected[v.user.id] = true;
        });
        this.users = data;
        let bundle;
        for (let i = 0; i < this.users.length; i++) {
            bundle = this.users[i].currentTrainingBundles
                .filter(v => v.bundleSpec.id === this.event.specification.id)[0];
            this.userBundle[this.users[i].id] = bundle;
        }
    }

    private getPolicy() {
        this.canDelete = this.policy.get('reservation', 'canDelete');
        this.canCompleteEvent = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canComplete') && this.isTraining();
        this.canDeleteEvent = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canDelete');
        this.canConfirm = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canConfirm');
        this.canBook = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canBook');
        this.canBookAll = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canBookAll');
    }

    isTraining() {
        return this.event.type === 'P' || this.event.type === 'C';
    }


    private async findById(id: number) {
        const [data, error] = await this.facade.findEventById(id);
        if (error) {
            throw error;
        }
        this.event = data;
    }

    getType() {
        if (!!this.event) {
            return this.EVENT_TYPES[this.event.type];
        }
    }

    async removeReservation(id: any) {
        const [data, error] = await this.facade.deleteOneReservation(this.event.id, id);
        if (error) {
            throw error;
        }
    }

    async deleteReservation(id: any) {
        await this.removeReservation(id);
        await this.findById(this.event.id);
    }

    async confirm() {
        if (this.event.type === 'C') {
            for (const res of this.event.reservations) {
                const [data, error] = await this.confirmReservation(res.id);
            }
        } else if (this.event.type === 'P') {
            const [data, error] = await this.confirmReservation(this.event.reservation.id);
            if (error) {
                throw error;
            }
        }
        await this.findById(this.event.id);
    }

    private async confirmReservation(id: any) {
        return await this.facade.confirmReservation(id);
    }

    isDisabledConfirmed() {
        if (this.event.type === 'P') {
            return this.event.reservation.confirmed;
        }
        else if (this.event.type === 'C') {
            if (this.event.reservations.length > 0) {
                return !this.event.reservations.map(v => v.confirmed).reduce((p, c) => p && c)[0];
            }
            return true;
        }
        return true;
    }

    async deleteEvent() {
        let [_, error] = [undefined, undefined];
        if (this.event.type === 'C') {
            [_, error] = await this.facade.deleteCourseEvent(this.event.id);
        }
        else if (this.event.type === 'P') {
            [_, error] = await this.facade.deleteOneReservation(this.event.id, this.event.reservation.id);
        }
        else if (this.event.type === 'H') {
            [_, error] = await this.facade.deleteHoliday(this.event.id);
        }
        else {
            [_, error] = await this.facade.deleteTimeOff(this.event.id);
        }
        if (error) {
            return this.snackBar.open(error.error.message);
        }
        const root = this.route.parent.parent.snapshot.routeConfig.path;
        await this.router.navigate([root, 'calendar']);
    }

    isDisabledCompleted() {
        if (this.event.type === 'P') {
            return this.event.session.completed;
        }
        return true;
    }

    async complete() {
        if (this.event.type === 'P') {
            const [data, error] = await this.facade.completeEvent(this.event.id);
            if (error) {
                this.snackBar.open(error.error.message);
            }
        }
        await this.findById(this.event.id);
    }

    async reserveFromEvent(userId, bundleId) {
        const [data, error] = await this.facade
            .createReservationFromEvent(userId, this.event.id, bundleId);
        if (error) {
            this.snackBar.open(error.error.message);
        }
        return data;
    }

    bookAll() {
        const dialogRef = this.dialog.open(ReservationModalComponent, {
            data: {
                users: this.users,
                selected: Object.assign({}, this.userSelected)
            }
        });

        dialogRef.afterClosed().subscribe(async res => {
            if (res) {
                for (const userId in res) {
                    await this.updateReservations(userId, res);
                }
                await this.findById(this.event.id);
            }
        });

    }

    private async updateReservations(userId: string, res) {
        if (this.userSelected[userId] !== res[userId]) {
            if (res[userId]) {
                const bundleId = this.userBundle[userId].id;
                const data = await this.reserveFromEvent(userId, bundleId);
                this.userReservation[userId] = data.id;
            } else {
                await this.removeReservation(this.userReservation[userId]);
                this.userReservation[userId] = undefined;
            }
            this.userSelected[userId] = res[userId];
        }
    }

    async book() {
        const user = this.auth.getUser();
        const bundle = user.currentTrainingBundles
            .filter(v => v.bundleSpec.id === this.event.specification.id)[0];
        if (bundle) {
            await this.reserveFromEvent(user.id, bundle.id);
            await this.findById(this.event.id);
        }
    }
}
