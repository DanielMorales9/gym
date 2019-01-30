import {ErrorHandler, NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {
    ApiPrefixInterceptor,
    CacheInterceptor,
    HttpCacheService,
    HttpService,
    XhrInterceptor
} from "./http";
import {GlobalErrorHandler} from "../services/global-error-handler.service";
import {SharedModule} from "../shared";


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XhrInterceptor,
            multi: true
        },
        {
            provide: HttpClient,
            useClass: HttpService
        },
        HttpCacheService,
        ApiPrefixInterceptor,
        CacheInterceptor]
})
export class CoreModule {

}

