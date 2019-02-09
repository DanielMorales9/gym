import { ErrorHandler, Injectable} from '@angular/core';
import {NotificationService} from "./notification.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private notificationService: NotificationService) { }

    handleError(err) {
        console.error(err);

        if (err.hasOwnProperty("status")) {
            if (err.status >= 400) {
                this.notificationService.sendMessage({
                    text: err.error.message,
                    class: 'alert-danger'
                });
            }
        }
    }

}
