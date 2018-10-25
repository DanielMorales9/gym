import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {VerificationComponent} from "./verification.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', component: VerificationComponent },
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [
      RouterModule
  ]
})
export class VerificationRouting { }
