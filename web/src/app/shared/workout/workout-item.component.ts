import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {WorkoutModalComponent} from './workout-modal.component';

@Component({
    selector: 'workout-item',
    templateUrl: './workout-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
})
export class WorkoutItemComponent {
    constructor(private dialog: MatDialog) {
    }

    @Input() open: boolean;
    @Input() workout: any;
    @Input() canDelete: boolean;
    @Input() canEdit: boolean;

    @Output() done = new EventEmitter();

    editWorkout = this.openDialog;


    openDialog(): void {
        const title = 'Modifica Workout';

        const dialogRef = this.dialog.open(WorkoutModalComponent, {
            data: {
                title: title,
                workout: this.workout
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.edit(res);
            }
        });
    }

    deleteWorkout() {
        const confirmed = confirm(`Vuoi eliminare il workout ${this.workout.name}?`);
        if (confirmed) {
            this.done.emit({type: 'delete', workout: this.workout});
        }
    }

    edit(res?) {
        this.done.emit({type: 'patch', workout: (!!res) ? res : this.workout});
    }

    goToInfo() {
        this.done.emit({type: 'info', workout: this.workout});
    }
}
