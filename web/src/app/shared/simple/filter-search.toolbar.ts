import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'filter-search',
    templateUrl: './filter-search.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
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
        switch (type) {
            case 'name':
                if (this.name !== undefined) { this.query.name = this.name; }
                else { delete this.query.name; }
                break;
            case this.filterName:
                if (!!event.value) {
                    this.query[this.filterName] = event.value;
                } else {
                    delete this.query[this.filterName];
                }
                break;
        }

        for (const key in this.query) {
            if (!this.query[key]) {
                delete this.query[key];
            }
        }


        this.done.emit(this.query);
    }
}

