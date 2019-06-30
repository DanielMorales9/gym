import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BundleSpecsService, UserService} from '../../shared/services';
import {AppService} from '../../services';
import {NotificationService} from '../../services';

@Component({
    templateUrl: './training.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

    user: any;
    roles: string[];
    sales: any[];
    empty = false;

    id: number;
    private sub: any;
    current_role_view: number;
    email: string;

    constructor(private messageService: NotificationService,
                private userService: UserService,
                private bundleService: BundleSpecsService,
                private route: ActivatedRoute,
                private router: Router,
                private app: AppService) {
        this.current_role_view = this.app.currentRole;
        this.email = this.app.user.email;
    }

    ngOnInit(): void {
        this.sub = this.route.parent.params.subscribe(params => {
            this.id = +params['id?'];
            this.updateUser();
        });
    }

    updateUser() {
        const closure = (res => {
            this.user = res;
            this.userService.getCurrentTrainingBundles(this.user.id).subscribe( r => {
                    this.user.currentTrainingBundles = r['_embedded'].personalTrainingBundles;
            }, err => this._error());
        });

        if (this.id) {
            this.userService.findById(this.id).subscribe(closure, this._error());
        } else {
            this.userService.findByEmail(this.email).subscribe( closure, this._error());
        }
    }

    _error() {
        return err => {
            const message = {
                text: 'Qualcosa è andato storto',
                class: 'alert-danger'
            };
            this.messageService.sendMessage(message);
        };
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    goTo(id) {
        this.router.navigate(['session', id]);
    }

}
