import {Component, OnInit} from '@angular/core';
import {Gym} from '../shared/model';
import {AppService, AuthService, GymService, SnackBarService} from '../services';
import {MatDialog} from '@angular/material';
import {GymModalComponent} from './gym-modal.component';

@Component({
    templateUrl: './gym-settings.component.html',
    styleUrls: ['../styles/root.css', '../styles/card.css'],
})
export class GymSettingsComponent implements OnInit {

    gym: Gym;
    canEdit: boolean;

    constructor(private gymService: GymService,
                private snackbar: SnackBarService,
                private dialog: MatDialog) {
        this.canEdit = this.gymService.canEdit();
    }

    ngOnInit(): void {
        this.gymService.getConfig().subscribe((res: Gym) => {
            this.gym = res;
        });
    }

    openDialog(): void {

        const dialogRef = this.dialog.open(GymModalComponent, {
            data: this.gym
        });

        dialogRef.afterClosed().subscribe((gym) => {
            if (gym) { this.gymService.patch(gym).subscribe((g: Gym) => this.gym = g); }
        });
    }
}
