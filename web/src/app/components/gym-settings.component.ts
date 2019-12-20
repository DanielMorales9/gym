import {Component, OnInit} from '@angular/core';
import {Gym} from '../shared/model';
import {GymService} from '../services';
import {MatDialog} from '@angular/material';
import {GymModalComponent} from './gym-modal.component';
import {SnackBarService} from '../core/utilities';

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

    async ngOnInit(): Promise<void> {
        const [data, error] = await this.gymService.getConfig();

        if (error) {
            throw error;
        }
        else {
            this.gym = data;
        }
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
