import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {BundleTypeConstant} from '../../shared/model';


@Component({
    selector: 'bundle-spec-select-item',
    templateUrl: './bundle-spec-select-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleSpecSelectItemComponent {

    @Input() spec: any;
    @Output() done = new EventEmitter();

    @Input() selected: boolean;
    PERSONAL: BundleTypeConstant.PERSONAL;
    COURSE: BundleTypeConstant.COURSE;

    constructor() {}

    selectBundle() {
        this.selected = !this.selected;
        this.done.emit();
    }


}
