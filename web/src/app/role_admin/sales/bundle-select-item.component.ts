import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
    selector: 'bundle-select-item',
    templateUrl: './bundle-select-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css', '../../styles/search-card-list.css']
})
export class BundleSelectItemComponent {

    @Input() bundle: any;
    @Output() done = new EventEmitter();

    @Input() selected: boolean;
    PERSONAL: 'P';
    COURSE: 'C';

    constructor() {}

    selectBundle() {
        this.selected = !this.selected;
        this.done.emit();
    }


}
