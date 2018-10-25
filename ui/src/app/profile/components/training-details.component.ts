import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ChangeViewService} from "../../core/services/change-view.service";
import {AppService} from "../../core/services/app.service";
import {BundlesService} from "../../core/services/bundles.service";


@Component({
    selector: 'training-details',
    templateUrl: './training-details.component.html',
    styleUrls: ['../../app.component.css']
})
export class TrainingDetailsComponent implements OnInit {

    @Input() public training: any;

    @Output() private event = new EventEmitter();
    hidden: boolean;
    current_role_view: number;

    constructor(private app: AppService,
                private bundleService: BundlesService,
                private changeViewService: ChangeViewService) {
        this.current_role_view = this.app.current_role_view;
        this.changeViewService.getView().subscribe(value => this.current_role_view = value)
    }

    getDate(st, et) {
        let startTime = new Date(st);
        let endTime = new Date(et);
        return startTime.getDate() + "/"
            + (startTime.getMonth()+1)  + "/"
            + startTime.getFullYear() + " "
            + endTime.getHours() + "-"
            + startTime.getHours() + " h";
    }

    ngOnInit(): void {
        this.hidden = false;
    }

    toggle() {
        this.hidden = !this.hidden;
        if (!this.training.sessions) {
            if (this.hidden) {
                let endpoint = this.training._links.sessions.href;
                this.bundleService.getSessions(endpoint)
                    .subscribe( res => {
                        this.training.sessions = res["_embedded"].personalTrainingSessions || [];
                        this.training.leftSessions = this.training.numSessions - this.training.sessions.length
                    }, err => {
                        console.log(err)
                    });
            }
        }
    }

}