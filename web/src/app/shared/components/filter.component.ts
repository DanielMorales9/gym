import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'filter-toolbar',
    templateUrl: './filter.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class FilterComponent {

    @Input() filters: any;
    @Input() selected: any;

    @Output() change: EventEmitter<any> = new EventEmitter();

    constructor() { }

    emit($event) {
        this.change.emit($event);
    }
}
