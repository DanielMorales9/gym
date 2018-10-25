import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ErrorRouting} from "./error.routing";
import {ErrorComponent} from "./error.component";

@NgModule({
  imports: [
    CommonModule,
      ErrorRouting
  ],
  declarations: [ErrorComponent]
})
export class ErrorModule { }
