import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'search-date',
    templateUrl: './search-date.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchDateToolbar {

    @Input() query: string;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();

    emit(type, event) {
        this.done.emit({type: type, date: event.value});
    }
}

