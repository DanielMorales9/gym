import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Gym} from '../model';
import {GymService} from '../../services';
import {MatDialog} from '@angular/material';
import {GymModalComponent} from './gym-modal.component';
import {SnackBarService} from '../../core/utilities';
import {filter, share, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from '../../core/authentication';

@Component({
    templateUrl: './gym-settings.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
})
export class GymSettingsComponent implements OnInit {

    gym: Gym;
    canEdit: boolean;

    constructor(private gymService: GymService,
                private authService: AuthenticationService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
        this.authService.getConfig()
            .pipe(
                take(1),
                share()
            )
            .subscribe(res => this.gym = res);
        this.canEdit = this.gymService.canEdit();
    }

    ngOnInit(): void {}

    openDialog(): void {

        const dialogRef = this.dialog.open(GymModalComponent, {
            data: this.gym
        });

        dialogRef.afterClosed()
            .pipe(filter(v => !!v),
                switchMap(gym => this.gymService.patch(gym))).subscribe(r => this.gym = r);
    }
}
