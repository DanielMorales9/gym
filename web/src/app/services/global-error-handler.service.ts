import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from "@angular/common/http";
import {first} from "rxjs/operators";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector,
                private http: HttpClient) {}

    get router(): Router {
        return this.injector.get(Router);
    }

    handleError(err) {
        console.log(err);
        console.log(err.stack);
        let message = "";
        if (!!err) {
            message = (err.message) ? err.message : (err.error) ? (err.error.message) ? err.error.message : err : err;
            message += '\n' + err.stack;
        }

        this.http.post('/log/error/', message)
            .pipe(first()).subscribe(_ => {
            this.router.navigate(['/error'], {
                replaceUrl: true,
                queryParams: {
                    message: message
                }
            });
        });



    }

}
