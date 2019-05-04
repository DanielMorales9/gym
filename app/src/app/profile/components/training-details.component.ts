import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BundlesService} from '../../shared/services';
import {AppService} from '../../services';

@Component({
    selector: 'training-details',
    templateUrl: './training-details.component.html',
    styleUrls: ['../../styles/root.css']
})
export class TrainingDetailsComponent implements OnInit {

    @Input() public training: any;

    @Output() private event = new EventEmitter();
    hidden: boolean;
    current_role_view: number;

    constructor(private app: AppService,
                private bundleService: BundlesService) {
        this.current_role_view = this.app.currentRole;
    }

    getDate(st, et) {
        const startTime = new Date(st);
        const endTime = new Date(et);
        return startTime.getDate() + '/'
            + (startTime.getMonth() + 1)  + '/'
            + startTime.getFullYear() + ' '
            + endTime.getHours() + '-'
            + startTime.getHours() + ' h';
    }

    ngOnInit(): void {
        this.hidden = false;
    }

    toggle() {
        this.hidden = !this.hidden;
        if (!this.training.sessions) {
            if (this.hidden) {
                const endpoint = this.training._links.sessions.href;
                this.bundleService.getSessions(endpoint)
                    .subscribe( res => {
                        this.training.sessions = res['_embedded'].personalTrainingSessions || [];
                        this.training.leftSessions = this.training.numSessions - this.training.sessions.length;
                    }, err => {
                        console.log(err);
                    });
            }
        }
    }

}
