import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.authenticationService.isAuthenticated()) {
            return next.handle(req)
        }
        const xhr = req.clone({
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'authorization': this.authenticationService.getAuthorizationHeader()
            }
        });
        return next.handle(xhr);
    }
}
