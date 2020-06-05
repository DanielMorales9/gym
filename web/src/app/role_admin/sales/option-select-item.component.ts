import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Option, OptionType} from '../../shared/model';


@Component({
    selector: 'option-select-item',
    templateUrl: './option-select-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectItemComponent {

    @Input() option: Option;
    @Output() done = new EventEmitter();

    @Input() selected: boolean;

    optionNames = OptionType;

    constructor() {}

    selectOption() {
        this.selected = !this.selected;
        this.done.emit();
    }


}
