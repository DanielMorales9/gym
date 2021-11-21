import {ChangeDetectionStrategy, Component} from '@angular/core';
import {version} from '../../../../package.json';
import {AppUpdateService} from '../../services';

@Component({
    templateUrl: './app-info.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInfoComponent {

    version: string = version;

    constructor(private updateService: AppUpdateService) {}

    checkForUpdates() {
        this.updateService.checkForUpdate();
    }

    canCheck() {
        return this.updateService.isEnabled;
    }
}
