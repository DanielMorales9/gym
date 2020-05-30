import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'filter-search',
    templateUrl: './filter-search.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class FilterSearchToolbar implements OnInit {
    @Input() query: any;
    @Input() text: string;

    @Input() filters: any;
    @Input() filterName: string;
    @Input() selected: any;

    @Output() done: EventEmitter<any> = new EventEmitter();

    name: string;

    ngOnInit(): void {
        if (this.query) {
            this.name = this.query.name || undefined;
        }
    }

    emit(type?, event?) {
        const query = Object.assign({}, this.query);
        switch (type) {
            case 'name':
                if (this.name !== undefined) { query.name = this.name; }
                else { delete query.name; }
                break;
            case this.filterName:
                if (!!event.value) {
                    query[this.filterName] = event.value;
                } else {
                    delete query[this.filterName];
                }
                break;
        }

        for (const key in query) {
            if (!query[key]) {
                delete query[key];
            }
        }


        this.done.emit(query);
    }
}

