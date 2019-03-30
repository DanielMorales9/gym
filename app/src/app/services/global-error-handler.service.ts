import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {Router} from "@angular/router";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private injector: Injector
    ) { }

    get router(): Router {
        return this.injector.get(Router);
    };


    handleError(err) {
        console.error(err);
        let message = (err.message) ? err.message : (err.error) ? (err.error.message) ? err.error.message : err : err;

        // TODO decide what you want to do with errors
        // if (err.hasOwnProperty("status")) {
        //     if (err.status >= 400) {
        //         this.notificationService.sendMessage({
        //             text: message,
        //             class: 'alert-danger'
        //         });
        //     }
        // }


        this.router.navigate(['/error'], {
            queryParams: {
                title: 'Errore sconosciuto',
                message: message
            }
        });
    }

}
