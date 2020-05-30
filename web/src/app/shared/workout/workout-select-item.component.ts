import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
    selector: 'workout-select-item',
    templateUrl: './workout-select-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutSelectItemComponent {

    @Input() workout: any;
    @Output() done = new EventEmitter();

    @Input() selected: boolean;

    constructor() {}

    selectWorkout() {
        this.selected = !this.selected;
        this.done.emit();
    }


}
