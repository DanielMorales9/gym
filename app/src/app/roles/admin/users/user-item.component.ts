import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from '../../../shared/components/users';
import {User} from '../../../shared/model';


@Component({
    selector: 'user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['../../../styles/search-list.css', '../../../styles/root.css'],
})
export class UserItemComponent {

    @Input() user: User;
    @Input() canDelete: boolean;

    @Output() done = new EventEmitter();

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
            if (user) this.done.emit({type: 'patch', user: user})
        });
    }

    deleteUser() {
        this.done.emit({type: 'delete', user: this.user})
    }

}
