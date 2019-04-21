import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'mixed-search',
    templateUrl: './search-mixed.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchMixedToolbar {

    @Input() query: string;
    @Input() textPlaceholder: string;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();

    emit(type, event) {
        switch (type) {
            case 'query':
                this.done.emit({type: type, value: this.query});
                break;
            case 'date':
                this.done.emit({type: type, value: event.value});
                break;
        }
    }
}

