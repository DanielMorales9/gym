import {Component, OnInit} from '@angular/core';
import {CalendarFacade} from '../../core/facades';
import {ActivatedRoute, Router} from '@angular/router';
import {PolicyService} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {MatDialog} from '@angular/material/dialog';
import {ReservationModalComponent} from './reservation.modal.component';
import {AuthenticationService} from '../../core/authentication';
import {BaseComponent} from '../base-component';
import {map, mergeMap, takeUntil} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

@Component({
    templateUrl: './event-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
})
export class EventDetailsComponent extends BaseComponent implements OnInit {

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
    canAssignWorkout: boolean;
    canDeleteWorkout: boolean;
    canEditWorkout: boolean;

    constructor(private facade: CalendarFacade,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private router: Router,
                private auth: AuthenticationService,
                private snackBar: SnackBarService,
                private policy: PolicyService) {
        super();
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
            this.computeMaps(id);
        }
    }

    private computeMaps(id: number) {
        this.event.reservations.forEach(v => {
            this.userReservation[v.user.id] = v.id;
            this.userSelected[v.user.id] = true;
        });

        this.facade.getUsersByEventId(id)
            .pipe(
                takeUntil(this.unsubscribe$),
                mergeMap((users: any) => {
                    const allIds = users.map(user => this.facade.getCurrentTrainingBundles(user.id));
                    return forkJoin(...allIds).pipe(
                        map((idArr) => {
                            users.forEach((eachUser, index) => {
                                eachUser.currentTrainingBundles = idArr[index];
                                this.userBundle[eachUser.id] = idArr[index]
                                    .filter(v => v.bundleSpec.id === this.event.specification.id)[0];
                            });
                            return users;
                        })
                    );
                })
            ).subscribe(res => this.users = res);
    }

    private getPolicy() {
        this.canDelete = this.policy.get('reservation', 'canDelete');
        this.canCompleteEvent = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canComplete') && this.isTraining();
        this.canDeleteEvent = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canDelete');
        this.canConfirm = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canConfirm');
        this.canBook = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canBook');
        this.canBookAll = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canBookAll');
        this.canAssignWorkout = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canAssignWorkout') &&
            !this.hasWorkout();
        this.canDeleteWorkout = this.policy.get('workout', 'canDelete');
        this.canEditWorkout = this.policy.get('workout', 'canEdit');
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

    removeReservation(id: any): Observable<any> {
        return this.facade.deleteOneReservation(this.event.id, id)
            .pipe(takeUntil(this.unsubscribe$));
    }

    async deleteReservation(id: any) {
        this.removeReservation(id)
            .subscribe(r => r);
        await this.findById(this.event.id);
    }

    async confirm() {
        let reservations;
        if (this.event.type === 'C') {
            reservations = this.event.reservations;
        } else if (this.event.type === 'P') {
            reservations = [this.event.reservation];
        }
        forkJoin(reservations.map(r => this.confirmReservation(r.id)))
            .subscribe(async r =>  await this.findById(this.event.id));
    }

    private confirmReservation(id: any) {
        return this.facade.confirmReservation(id)
            .pipe(takeUntil(this.unsubscribe$));
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
            this.removeReservation(this.event.reservation.id)
                .subscribe(r => this.goBack(),
                        err => this.snackBar.open(err.error.message));
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
        this.goBack();
    }

    private goBack() {
        const root = this.route.parent.parent.snapshot.routeConfig.path;
        this.router.navigate([root, 'calendar'], {
            replaceUrl: true,
        });
    }

    isDisabledCompleted() {
        if (this.event.type === 'P') {
            return this.event.session.completed;
        }
        return true;
    }

    completeEvent() {
        if (this.event.type === 'P') {
            this.facade.completeEvent(this.event.id)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(async r => await this.findById(this.event.id),
                        error => this.snackBar.open(error.error.message));
        }
    }

    reserveFromEvent(userId, bundleId): Observable<any> {
        return this.facade.createReservationFromEvent(userId, this.event.id, bundleId)
            .pipe(takeUntil(this.unsubscribe$));
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
                this.reserveFromEvent(userId, bundleId)
                    .subscribe(r => this.userReservation[userId] = r.id);

            } else {
                this.removeReservation(this.userReservation[userId])
                    .subscribe(r => this.userReservation[userId] = undefined);
            }
            this.userSelected[userId] = res[userId];
        }
    }

    async book() {
        const user = this.auth.getUser();
        user.currentTrainingBundles = await this.facade.getCurrentTrainingBundles(user.id).toPromise();
        const bundle = user.currentTrainingBundles
            .filter(v => v.bundleSpec.id === this.event.specification.id)[0];
        if (bundle) {
            this.reserveFromEvent(user.id, bundle.id)
                .subscribe(async d => await this.findById(this.event.id));
        }
    }

    assignWorkout() {
        this.router.navigate(['assignWorkout'], {relativeTo: this.route});
    }

    hasWorkout() {
        if (!!this.event && this.event.type === 'P') {
            return this.event.session.workouts.length > 0;
        }
        return false;
    }

    goToWorkout() {
        this.router.navigate(['programme'], {relativeTo: this.route});
    }
}
