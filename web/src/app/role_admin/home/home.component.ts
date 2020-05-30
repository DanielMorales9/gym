import {User} from '../../shared/model';
import {AuthenticationService} from '../../core/authentication';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    user: User;

    constructor(private auth: AuthenticationService) { }

    ngOnInit() {
        this.user = this.auth.getUser();
    }
}
