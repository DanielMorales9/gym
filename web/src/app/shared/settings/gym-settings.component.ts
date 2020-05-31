import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Gym} from '../model';
import {GymService} from '../../services';
import {MatDialog} from '@angular/material';
import {GymModalComponent} from './gym-modal.component';
import {SnackBarService} from '../../core/utilities';
import {filter, share, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from '../../core/authentication';
import {PolicyService} from '../../core/policy';

@Component({
    templateUrl: './gym-settings.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GymSettingsComponent implements OnInit {

    gym: Gym;
    canEdit: boolean;

    constructor(private gymService: GymService,
                private authService: AuthenticationService,
                private snackbar: SnackBarService,
                private cdr: ChangeDetectorRef,
                private policy: PolicyService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.authService.getConfig()
            .pipe(
                take(1),
                share()
            )
            .subscribe(res => {
                this.gym = res;
                this.cdr.detectChanges();
            });
        this.canEdit = this.policy.get('gym', 'canEdit');
    }

    openDialog(): void {

        const dialogRef = this.dialog.open(GymModalComponent, {
            data: this.gym
        });

        dialogRef.afterClosed()
            .pipe(filter(v => !!v),
                switchMap(gym => this.gymService.patch(gym))).subscribe(r => this.gym = r);
    }
}
