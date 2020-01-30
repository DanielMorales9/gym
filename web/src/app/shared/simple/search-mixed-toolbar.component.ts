import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'mixed-search',
    templateUrl: './search-mixed-toolbar.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchMixedToolbar implements OnInit {

    @Input() query: any;
    @Input() textPlaceholder: string;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;
    @Input() filters: any;
    @Input() filterName: string;
    @Input() selected: any;

    @Output() done: EventEmitter<any> = new EventEmitter();

    name: string;
    date: any;

    ngOnInit(): void {
        if (this.query) {
            this.name = this.query.name || undefined;
            this.date = this.query.date || undefined;
        }
    }

    emit(type, event) {
        switch (type) {
            case 'name':
                if (!!this.name) { this.query.name = this.name; }
                else { delete this.query.name; }
                break;
            case 'date':
                if (!!event.value) { this.query.date = event.value; }
                else { delete this.query.date; }
                break;
            default:
                if (event.value === undefined || event.value === null) { delete this.query[this.filterName]; }
                else { this.query[this.filterName] = event.value; }
                break;
        }
        this.done.emit(this.query);
    }
}

