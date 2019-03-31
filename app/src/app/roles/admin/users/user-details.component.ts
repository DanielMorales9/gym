import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/model';
import {UserHelperService, UserService} from '../../../shared/services';
import {AppService} from '../../../services';
import {MatDialog} from '@angular/material';
import {UserPatchModalComponent} from '../../../shared/components/users';
import {ActivatedRoute} from '@angular/router';


@Component({
    templateUrl: './user-details.component.html',
    styleUrls: ['../../../root.css', '../../../card.css'],
})
export class UserDetailsComponent implements OnInit {

    user: User;

    mailto = undefined;

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.user = new User();
        this.route.params.subscribe(params => {
            const id = params['id'];
            this.userService.findById(id).subscribe((user: User) => {
                this.user = user;
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


    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user)
    }
}
