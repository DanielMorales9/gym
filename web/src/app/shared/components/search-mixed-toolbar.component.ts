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
                if (this.isNotNull(this.name)) { this.query.name = this.name; }
                else { delete this.query.name; }
                break;
            case 'date':
                if (this.isNotNull(event.value)) { this.query.date = event.value; }
                else { delete this.query.date; }
                break;
            case this.filterName:
                if (this.isNotNull(event.value)) { this.query[this.filterName] = event.value; }
                else { delete this.query[this.filterName]; }
                break;
        }
        this.done.emit(this.query);
    }

    private isNotNull(value) {
        return !(value === null || value === undefined);
    }
}

