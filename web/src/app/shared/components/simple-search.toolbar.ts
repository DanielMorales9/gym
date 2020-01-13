import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'simple-search',
    templateUrl: './simple-search.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SimpleSearchToolbar {
    @Input() query: string;
    @Input() text: string;

    @Output() done: EventEmitter<any> = new EventEmitter();

    emit() {
        this.done.emit({query: this.query})
    }
}

