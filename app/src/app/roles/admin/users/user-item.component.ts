import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {UserPatchModalComponent} from '../../../shared/components/users';
import {UserService} from '../../../shared/services';
import {User} from '../../../shared/model';
import {AppService} from '../../../services';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    selector: 'user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['../../../search-and-list.css', '../../../root.css'],
})
export class UserItemComponent {

    @Input() user: User;

    @Output() done = new EventEmitter();

    constructor(private dialog: MatDialog,
                private app: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private service: UserService) {
    }

    openEditDialog() {
        const dialogRef = this.dialog.open(UserPatchModalComponent, {
            data: {
                user: this.user
            }
        });

        dialogRef.afterClosed().subscribe(_ => {
            this.done.emit()
        });
    }

    deleteUser() {
        let confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            this.service.delete(this.user.id).subscribe(_ => this.done.emit())
        }
    }

    goToDetails() {
        return this.router.navigate(["users", this.user.id], { relativeTo: this.route });
    }

    canDelete() {
        return this.app.user.id !== ((!this.user) ? 0 : this.user.id);
    }

}
