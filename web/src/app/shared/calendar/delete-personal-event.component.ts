import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'delete-personal-event',
    templateUrl: './delete-personal-event.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class DeletePersonalEventComponent {

    @Input()
    public event: any;

    constructor() { }

}
