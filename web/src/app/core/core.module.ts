import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ApiPrefixInterceptor, CacheInterceptor, HttpCacheService, HttpService, LoaderInterceptor, XhrInterceptor} from './http';
import {LoaderComponent, LoaderService} from './loader';
import {MatProgressBarModule} from '@angular/material';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MatProgressBarModule
    ],
    declarations: [LoaderComponent],
    exports: [LoaderComponent],
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
        CacheInterceptor,
        LoaderInterceptor,
        LoaderService,
        ApiPrefixInterceptor]
})
export class CoreModule {

}
