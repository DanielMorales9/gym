import {Component, OnInit} from "@angular/core";

import {CalendarView} from "angular-calendar";
import {AppService, ChangeViewService, DateService, GymConfigurationService, NotificationService} from "../../services";
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './calendar.component.html',
    styleUrls: ['../../root.css']
})
export class CalendarComponent implements OnInit {


    current_role_view: number;
    email: string;

    view: CalendarView;
    viewDate: Date;
    activeDayIsOpen: boolean = false;

    dayStartHour: number;
    dayEndHour: number;
    excludeDays: number[];
    weekStartsOn: number;


    constructor(private appService: AppService,
                private messageService: NotificationService,
                private dateService: DateService,
                private gymConf: GymConfigurationService,
                private changeViewService: ChangeViewService,
                private activatedRoute: ActivatedRoute) {
        this.current_role_view = this.appService.current_role_view;
        this.email = this.appService.user.email;
        this.changeViewService.getView().subscribe(value => {
            this.current_role_view = value;
        });
        this.initView();
        this.initViewDate();

    }

    private initViewDate() {
        let stringDate = this.activatedRoute.snapshot.queryParamMap.get('date');
        if (stringDate)
            this.viewDate = new Date(stringDate.replace("-", "/"));
        else
            this.viewDate = new Date();
    }

    private initView() {
        let view = this.activatedRoute.snapshot.queryParamMap.get('view');
        switch (view) {
            case "month":
                this.view = CalendarView.Month;
                break;
            case "week":
                this.view = CalendarView.Week;
                break;
            case "day":
                this.view = CalendarView.Day;
                break;
            default:
                this.view = CalendarView.Month;
                break;
        }
    }

    ngOnInit(): void {
        this.dayEndHour = this.gymConf.dayEndHour;
        this.dayStartHour = this.gymConf.dayStartHour;
        this.excludeDays = this.gymConf.excludeDays;
        this.weekStartsOn = this.gymConf.weekStartsOn;
    }

}
