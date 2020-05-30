import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'mixed-search',
    templateUrl: './search-mixed-toolbar.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
        const query = Object.assign({}, this.query);
        switch (type) {
            case 'name':
                if (!!this.name) { query.name = this.name; }
                else { delete query.name; }
                break;
            case 'date':
                if (!!event.value) { query.date = event.value; }
                else { delete query.date; }
                break;
            default:
                if (event.value === undefined || event.value === null) { delete query[this.filterName]; }
                else { query[this.filterName] = event.value; }
                break;
        }
        this.done.emit(query);
    }
}

