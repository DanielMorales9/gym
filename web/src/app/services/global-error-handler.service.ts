import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) {}

    get router(): Router {
        return this.injector.get(Router);
    }

    handleError(err) {
        if (!environment.production) {
            console.error(err);
        }
        const message = (err.message) ? err.message : (err.error) ? (err.error.message) ? err.error.message : err : err;


        this.router.navigate(['/error'], {
            replaceUrl: true,
            queryParams: {
                title: 'Errore sconosciuto',
                message: message
            }
        });
    }

}
