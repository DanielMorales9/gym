import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessageService} from "./services/message.service";
import {AppService} from "./services/app.service";
import {ExchangeBundleService} from "./services/exchange-bundle.service";
import {ExchangeUserService} from "./services/exchange-user.service";
import {ExchangeSaleService} from "./services/exchange-sale.service";
import {ChangeViewService} from "./services/change-view.service";
import {UserService} from "./services/users.service";
import {SalesService} from "./services/sales.service";
import {BundlesService} from "./services/bundles.service";
import {TimesOffService} from "./services/timesoff.service";
import {TrainingService} from "./services/training.service";
import {ApiPrefixInterceptor} from "./http/api-prefix.interceptor";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {XhrInterceptor} from "./http/xhr.interceptor";
import {HttpService} from "./http/http.service";
import {CacheInterceptor} from "./http/cache.interceptor";
import {ErrorHandlerInterceptor} from "./http/error-handler.interceptor";
import {HttpCacheService} from "./http/http-cache.service";
import {LoggerService} from "./logger.service";


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
        LoggerService,
        HttpCacheService,
        ApiPrefixInterceptor,
        ErrorHandlerInterceptor,
        CacheInterceptor,
        UserService,
        SalesService,
        BundlesService,
        TimesOffService,
        TrainingService,
        ChangeViewService,
        ExchangeSaleService,
        ExchangeUserService,
        ExchangeBundleService,
        MessageService,
        AppService]
})
export class CoreModule {

}
