import { ErrorHandler, Injectable} from '@angular/core';
import {NotificationService} from "./notification.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private notificationService: NotificationService) { }

    handleError(error) {
        console.error(error);

        if (error.hasOwnProperty("status")) {
            if (error.status >= 400) {
                console.log(typeof error.message);
                this.notificationService.sendMessage({
                    class: 'alert-danger',
                    text: error.message.toString()
                });
            }
        }
    }

}
