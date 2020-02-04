import {Component, OnInit} from '@angular/core';
import {CalendarFacade} from '../../core/facades';
import {ActivatedRoute, Router} from '@angular/router';
import {PolicyService} from '../../core/policy';
import {SnackBarService} from '../../core/utilities';

@Component({
    templateUrl: './event-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
})
export class EventDetailsComponent implements OnInit {

    event: any;

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

    constructor(private facade: CalendarFacade,
                private route: ActivatedRoute,
                private router: Router,
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
    }

    private getPolicy() {
        this.canConfirm = this.policy.get('reservation', 'canConfirm') && this.isTraining();
        this.canDelete = this.policy.get('reservation', 'canDelete');
        this.canCompleteEvent = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canComplete') && this.isTraining();
        this.canDeleteEvent = this.policy.get(this.EVENT_ENTITY[this.event.type], 'canDelete');
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

    async deleteReservation(id: any) {
        const [data, error] = await this.facade.deleteOneReservation(this.event.id, id);
        if (error) {
            throw error;
        }
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
        let [data, error] = [undefined, undefined];
        if (this.event.type === 'C') {
            [data, error] = await this.facade.deleteCourseEvent(this.event.id);
        }
        else if (this.event.type === 'P') {
            [data, error] = await this.facade.deleteOneReservation(this.event.id, this.event.reservation.id);
        }
        else if (this.event.type === 'H') {
            [data, error] = await this.facade.deleteHoliday(this.event.id);
        }
        else {
            return;
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
}
