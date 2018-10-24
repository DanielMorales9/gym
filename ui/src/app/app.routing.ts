import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { UsersComponent } from "./users/users.component";
import { SalesComponent } from "./sales/sales.component";
import { BundlesComponent } from "./bundles/bundles.component";
import { BookingComponent } from "./booking/booking.component";
import { SingleUserComponent } from "./users/user-single.component";
import { UserProfileComponent } from "./users/user-profile.component";
import { MakeSaleComponent } from "./sales/sale-make.component";
import { SaleSummaryComponent } from "./sales/sale-summary.component";
import { TrainingComponent } from "./training/training.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},
    { path: 'login', loadChildren: "app/login/login.module#LoginModule"},
    { path: 'verification', loadChildren: "app/verification/verification.module#VerificationModule"},
    { path: 'error', loadChildren: "app/error/error.module#ErrorModule"},
    { path: 'home',
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'booking' , pathMatch: "full"},
            { path: 'users', component: UsersComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'bundles', component: BundlesComponent},
            { path: 'booking', component: BookingComponent}
        ]
    },
    { path: 'user/:id?', component: SingleUserComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: "full" },
            { path: 'profile', component: UserProfileComponent },
            { path: 'makeSale', component: MakeSaleComponent },
            { path: 'sales', component: SalesComponent },
            { path: 'summarySale/:saleId', component: SaleSummaryComponent },
            { path: 'trainings', component: TrainingComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRouting { }
