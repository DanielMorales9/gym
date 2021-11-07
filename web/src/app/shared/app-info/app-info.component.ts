import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import { version } from '../../../../package.json';
import {SwUpdate} from "@angular/service-worker";
import {BaseComponent} from "../base-component";
import {takeUntil} from "rxjs/operators";

@Component({
    templateUrl: './app-info.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInfoComponent extends BaseComponent implements OnInit {

    version: string = version;

    constructor(private swUpdate: SwUpdate) {
        super();
    }

    ngOnInit(): void {

    }

    checkUpdate() {
        this.swUpdate.checkForUpdate().then(()=> {
            if (confirm('Aggiornamento disponibile. ' +
                'Vuoi ricaricare la pagina per ottenere la nuova versione?')) {
                this.swUpdate.activateUpdate().then(() => {
                    window.location.reload();
                });
            }
        })
    }

    canCheck() {
        return this.swUpdate.isEnabled;
    }
}
