import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CalendarFacade} from '../../core/facades';
import {ActivatedRoute, Router} from '@angular/router';
import {PolicyService} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';
import {MatDialog} from '@angular/material/dialog';
import {ReservationModalComponent} from './reservation.modal.component';
import {AuthenticationService} from '../../core/authentication';
import {BaseComponent} from '../base-component';
import {filter, map, mergeMap, switchMap, takeUntil} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {User} from '../model';
import {Policy} from '../policy.interface';

@Component({
    templateUrl: './event-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsComponent extends BaseComponent implements Policy, OnInit {

    event: any;
    users: any;
    user: User;

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
                private cdr: ChangeDetectorRef,
                private policy: PolicyService) {
        super();
    }

    ngOnInit(): void {
        const id = +this.route.snapshot.params['id'];

        this.auth.getObservableUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
               this.user = v;
            });

        this.findById(id).subscribe(
            r => {
                this.getPolicies();
                if (r.type === 'C') {
                    this.computeMaps(id);
                }

                const displayedPaymentsColumns = ['index', 'confirmed', 'customer'];
                if (this.canDelete) {
                    displayedPaymentsColumns.push('actions');
                }

                this.displayedPaymentsColumns = displayedPaymentsColumns;
                this.cdr.detectChanges();
            }
        );
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
                    const allIds: Array<Observable<any>> = users.map(user => this.facade.getCurrentTrainingBundles(user.id));
                    return forkJoin(allIds)
                        .pipe(map((idArr) => {
                            users.forEach((eachUser, index) => {
                                eachUser.currentTrainingBundles = idArr[index];
                                this.userBundle[eachUser.id] = idArr[index]
                                    .filter(v => v.bundleSpec.id === this.event.specification.id)[0];
                            });
                            return users;
                        })
                    );
                })
            ).subscribe(res => {
            this.users = res;
            this.cdr.detectChanges();

        });
    }

    getPolicies() {
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

    private findById(id: number): Observable<any> {
        return this.facade.findEventById(id)
            .pipe(
                takeUntil(this.unsubscribe$),
                map(r => {
                    this.event = r;
                    return r;
                }));
    }

    getType() {
        if (!!this.event) {
            return this.EVENT_TYPES[this.event.type];
        }
    }

    private removeReservation(id: any): Observable<any> {
        return this.facade.deleteOneReservation(this.event.id, id)
            .pipe(takeUntil(this.unsubscribe$));
    }

    deleteReservation(id: any) {
        this.removeReservation(id)
            .pipe(switchMap(v => this.findById(this.event.id)))
            .subscribe(r => this.cdr.detectChanges());
    }

    confirm() {
        const obs: Array<Observable<any>> = this.event.reservations.map(r => this.confirmReservation(r.id));
        forkJoin(obs)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
                this.findById(this.event.id);
                this.cdr.detectChanges();
            });
    }

    private confirmReservation(id: any) {
        return this.facade.confirmReservation(id)
            .pipe(takeUntil(this.unsubscribe$));
    }

    isDisabledConfirmed() {
        if (this.event.type === 'P' || this.event.type === 'C') {
            if (this.event.reservations.length > 0) {
                return !this.event.reservations.map(v => v.confirmed).reduce((p, c) => p && c)[0];
            }
            return true;
        }
        return true;
    }

    deleteEvent() {
        let o;
        if (this.event.type === 'C') {
            o = this.facade.deleteCourseEvent(this.event.id);
        }
        else if (this.event.type === 'P') {
            o = this.removeReservation(this.event.reservations[0].id);
        }
        else if (this.event.type === 'H') {
            o = this.facade.deleteHoliday(this.event.id);
        }
        else {
            o = this.facade.deleteTimeOff(this.event.id);
        }
        o.pipe(takeUntil(this.unsubscribe$))
            .subscribe( r => {
                this.goBack();
                this.cdr.detectChanges();
            }, err => this.snackBar.open(err.error.message));
    }

    private goBack() {
        const root = this.route.parent.parent.snapshot.routeConfig.path;
        this.router.navigate([root, 'calendar'], {
            replaceUrl: true,
        });
    }

    isDisabledCompleted() {
        if (this.event.type === 'P') {
            return this.event.reservations[0].session.completed;
        }
        return true;
    }

    completeEvent() {
        if (this.event.type === 'P') {
            this.facade.completeEvent(this.event.id)
                .pipe(takeUntil(this.unsubscribe$),
                    switchMap(v => this.findById(this.event.id)))
                .subscribe(r => this.cdr.detectChanges(),
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

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                const fj = [];
                let ob;
                for (const userId in res) {
                    ob = this.updateReservations(userId, res);
                    if (!!ob) { fj.push(ob); }
                }
                forkJoin(fj)
                    .pipe(switchMap(_ => this.findById(this.event.id)))
                        .subscribe(v => this.cdr.detectChanges());
            }
        });

    }

    private updateReservations(userId: string, res) {
        let ob;
        if (this.userSelected[userId] !== res[userId]) {
            if (res[userId]) {
                const bundleId = this.userBundle[userId].id;
                ob = this.reserveFromEvent(userId, bundleId)
                    .pipe(map(r => {
                        this.userReservation[userId] = r.id;
                    }));

            } else {
                ob = this.removeReservation(this.userReservation[userId])
                    .pipe(map(r => {
                        this.userReservation[userId] = undefined;
                    }));
            }
            this.userSelected[userId] = res[userId];
        }
        return ob;
    }

    book() {
        this.facade.getCurrentTrainingBundles(this.user.id)
            .pipe(
                takeUntil(this.unsubscribe$),
                map(r => r.filter(v => v.bundleSpec.id === this.event.specification.id)[0]),
                filter(b => !!b),
                switchMap( bundle => this.reserveFromEvent(this.user.id, bundle.id)),
                switchMap(d => this.findById(this.event.id))
            )
            .subscribe(_ => this.cdr.detectChanges());

    }

    hasWorkout() {
        if (!!this.event && this.event.type === 'P') {
            return this.event.reservations[0].session.workouts.length > 0;
        }
        return false;
    }

    assignWorkout() {
        this.router.navigate(['sessions', this.event.reservations[0].session.id, 'assignWorkout'], {relativeTo: this.route});
    }

    goToWorkout() {
        this.router.navigate(['sessions', this.event.reservations[0].session.id, 'programme'], {relativeTo: this.route});
    }

    goToUserDetails() {
        this.router.navigate(['users', this.event.reservations[0].user.id],
            {relativeTo: this.route.parent.parent});
    }
}
