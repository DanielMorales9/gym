import {Component, OnInit} from "@angular/core";
import {NotificationService} from "../services";

@Component({
    styleUrls: ["../app.component.css"],
    templateUrl: './notifications.component.html',
    selector: "notifications"
})
export class NotificationsComponent implements OnInit {

    notifications = [];

    constructor(private messageService: NotificationService) {
    }

    ngOnInit(): void {
        this.messageService.getMessage().subscribe((mess) => {
            mess.timestamp = mess.timestamp || Date.now();
            this.notifications.push(mess);
        });
    }

    deleteNotifications() {
        this.notifications = []
    }

}