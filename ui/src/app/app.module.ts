import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "./app.component";
import {AppRouting} from "./app.routing";
import {CoreModule} from "./core/core.module";
import {AppService} from "./core/services/app.service";

//TODO Add Configuration
const baseUrl = "http://localhost";

//TODO Add Interceptors
@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    constructor(private app: AppService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let url = req.url.replace(baseUrl, "");
        const xhr = req.clone({
            url: "/api" + url,
            setHeaders: {
                'X-Requested-With': 'XMLHttpRequest',
                'authorization': this.app.getAuthorizationHeader()
            }
        });
        return next.handle(xhr);
    }
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        NgbModalModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CoreModule,
        AppRouting,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XhrInterceptor,
            multi: true
        }],
    bootstrap: [AppComponent]
})
export class AppModule { }

