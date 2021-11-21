import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CredentialsStorageDirective} from '../authentication';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    constructor(private credentialsStorage: CredentialsStorageDirective) {}

    public getAuthorizationHeader() {
        const credentials = this.credentialsStorage.get();
        if (!credentials) {
            return undefined;
        }
        return 'Basic ' + btoa(credentials.username + ':' + credentials.password);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const headers = this.getAuthorizationHeader();
        if (!headers) {
            return next.handle(req);
        }
        const xhr = req.clone({
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'authorization': headers
            }
        });
        return next.handle(xhr);
    }
}
