import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {LoaderService} from './loader.service';
import {LoaderState} from './loader';

@Component({
    selector: 'loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit, OnDestroy {

    show: boolean;

    private subscription: Subscription;
    constructor(private loaderService: LoaderService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscription = this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                this.show = state.show;
                this.cdr.detectChanges();
            });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
