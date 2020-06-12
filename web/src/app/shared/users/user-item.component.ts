import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {UserModalComponent} from './user-modal.component';
import {RoleNames, TypeNames, User} from '../model';


@Component({
    selector: 'user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemComponent {

    @Input() user: User;
    @Input() canDelete: boolean;
    @Input() canEdit: boolean;

    @Output() done = new EventEmitter();

    typeNames = TypeNames;

    constructor(private dialog: MatDialog) {
    }

    openEditDialog() {
        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica Utente',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed().subscribe(user => {
            if (user) { this.done.emit({type: 'patch', user: user}); }
        });
    }

    deleteUser() {
        this.done.emit({type: 'delete', user: this.user});
    }

    goToInfo() {
        this.done.emit({type: 'info', user: this.user});
    }
}
