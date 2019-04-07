import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'date-search',
    templateUrl: './search-with-date.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchWithDateToolbar {

    @Input() query: string;
    @Input() textPlaceholder: string;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();

    emit(type, event) {
        switch (type) {
            case 'query':
                this.done.emit({type: type, event: this.query});
                break;
            case 'date':
                this.done.emit({type: type, event: event});
                break;
        }
    }
}

