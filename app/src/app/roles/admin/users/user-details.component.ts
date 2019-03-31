import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/model';
import {UserHelperService, UserService} from '../../../shared/services';
import {AppService} from '../../../services';
import {MatDialog} from '@angular/material';
import {UserPatchModalComponent} from '../../../shared/components/users';
import {ActivatedRoute, Route, Router} from '@angular/router';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../../root.css', '../../../card.css'],
})
export class UserDetailsComponent implements OnInit {

    user: User;

    mailto = undefined;
    canDelete: boolean = false;

    constructor(private service: UserService,
                private appService: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.route.params.subscribe(params => {
            const id = params['id'];
            this.service.findById(id).subscribe((user: User) => {
                this.user = user;
                this.canDelete = this.user.id !== this.appService.user.id
            })
        })
    }

    openDialog(): void {

        const dialogRef = this.dialog.open(UserPatchModalComponent, {
            data: {
                user: this.user
            }
        });

        // dialogRef.afterClosed().subscribe(_ => {
        //     console.log('closed')
        // });
    }

    deleteUser() {
        let confirmed = confirm(`Vuoi rimuovere l'utente ${this.user.firstName} ${this.user.lastName}?`);
        if (confirmed) {
            this.service.delete(this.user.id)
                .subscribe(_ => this.router.navigateByUrl('/admins/users'))
        }
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user)
    }
}
