import { NgModule } from '@angular/core';
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


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [],
    exports: [],
    providers: [
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
export class CoreModule { }
