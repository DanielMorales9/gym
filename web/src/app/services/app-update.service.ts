import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {SwUpdate} from '@angular/service-worker';
import {interval, Subject} from 'rxjs';

@Injectable()
export class AppUpdateService implements OnDestroy, OnInit {

    UPDATE_INTERVAL: number = 1000 * 60; // 1 minute
    UPDATE_MESSAGE = 'Aggiornamento disponibile. \nVuoi ricaricare la pagina per ottenere la nuova versione?';

    unsubscribe$ = new Subject<void>();
    isEnabled = false;

    constructor(private swUpdate: SwUpdate) {}

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.isEnabled = this.swUpdate.isEnabled;

        if (this.swUpdate.isEnabled) {
            console.log('Check for updates is running every minute...');
            this.swUpdate.available
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(this.activateUpdate);


            interval(this.UPDATE_INTERVAL).subscribe(this.swUpdate.checkForUpdate);

        }
    }

    private activateUpdate() {
        if (confirm(this.UPDATE_MESSAGE)) {
            this.swUpdate.activateUpdate().then(() => {
                window.location.reload();
            });
        }
    }

    public checkForUpdate() {
        this.swUpdate.checkForUpdate()
            .then(this.activateUpdate);
    }
}
