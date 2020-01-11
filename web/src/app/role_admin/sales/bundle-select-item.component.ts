import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BundleType} from '../../shared/model';


@Component({
    selector: 'bundle-select-item',
    templateUrl: './bundle-select-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css']
})
export class BundleSelectItemComponent {

    @Input() bundle: any;
    @Output() done = new EventEmitter();

    @Input() selected: boolean;
    PERSONAL: BundleType.PERSONAL;
    COURSE: BundleType.COURSE;

    constructor() {}

    selectBundle() {
        this.selected = !this.selected;
        this.done.emit();
    }


}
