import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {
    ApiPrefixInterceptor,
    CacheInterceptor,
    ErrorHandlerInterceptor,
    HttpCacheService,
    HttpService,
    XhrInterceptor
} from "./http";


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
        ErrorHandlerInterceptor,
        CacheInterceptor]
})
export class CoreModule {

}

