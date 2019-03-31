import {Component, OnInit} from "@angular/core";
import {User} from "../shared/model";
import {AppService, ChangeViewService} from "../services";
import {UserHelperService, UserService} from "../shared/services";
import {MatDialog} from "@angular/material";
import {UserPatchModalComponent} from "../shared/components/users";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../root.css', 'card.component.css'],
})
export class ProfileComponent implements OnInit {

    user: User;

    mailto = undefined;

    constructor(private appService: AppService,
                private userService: UserService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.user = this.appService.user
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
