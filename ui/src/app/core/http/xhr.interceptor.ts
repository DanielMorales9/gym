//TODO Add Interceptors
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AppService} from "../services/app.service";
import {Injectable} from "@angular/core";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    constructor(private app: AppService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const xhr = req.clone({
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'authorization': this.app.getAuthorizationHeader()
            }
        });
        return next.handle(xhr);
    }
}
