import {Component, OnInit} from "@angular/core";

import {BaseCalendarModal} from "./base-calendar-modal";
import {NotificationService} from "../../services";

@Component({
    selector: 'customer-info-modal',
    templateUrl: './customer-info-modal.component.html',
    styleUrls: ['../../styles/root.css']
})
export class CustomerInfoModalComponent extends BaseCalendarModal implements OnInit {

    private MODAL_BUTTON: string = 'customer-info-modal-button';

    constructor(public notificationService: NotificationService) {
        super(notificationService);
    }

    ngOnInit(): void {
        this.modalButton = this.MODAL_BUTTON;
    }

    submit() {
        return false;
    }

}
