import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'info-personal-event',
    templateUrl: './info-personal-event.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class InfoPersonalEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
