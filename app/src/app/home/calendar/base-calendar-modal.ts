import {Component, EventEmitter, Input, Output} from "@angular/core";
import {NotificationService} from "../../services";

export abstract class BaseCalendarModal {

    @Input() modalData: {action: string, title: string, role: number, userId: number, event: any};
    @Output() event = new EventEmitter();

    loading : boolean = false;

    public message : {text: string, class: string};
    modalButton: string;

    constructor(public notificationService: NotificationService) {

    }

    abstract submit();

    close() {
        document.getElementById(this.modalButton).click();
    }

    onComplete() {
        this.notificationService.sendMessage(this.message);
        this.loading = false;
        this.close();
    }

}