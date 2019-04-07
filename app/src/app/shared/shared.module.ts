import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    NoItemComponent,
    UserModalComponent,
} from './components';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    BundlesNotDisabledService,
    BundlesService,
    SalesService,
    TimesOffService,
    TrainingService,
    UserHelperService,
    UserService
} from './services';
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatListModule, MatOptionModule, MatSelectModule, MatToolbarModule
} from '@angular/material';
import {SimpleSearchToolbar} from './directives';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatOptionModule,
        MatSelectModule,
        MatToolbarModule
    ],
    entryComponents: [
        UserModalComponent
    ],
    declarations: [
        NoItemComponent,
        SimpleSearchToolbar,
        UserModalComponent
    ],
    exports: [
        NoItemComponent,
        SimpleSearchToolbar
    ],
    providers: [
        BundlesService,
        BundlesNotDisabledService,
        SalesService,
        TimesOffService,
        TrainingService,
        UserService,
        UserHelperService
    ]

})
export class SharedModule {

}
