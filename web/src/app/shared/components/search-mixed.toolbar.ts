import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'mixed-search',
    templateUrl: './search-mixed.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchMixedToolbar implements OnInit {

    @Input() query: any;
    @Input() textPlaceholder: string;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();
    lastName: string;
    date: any;

    ngOnInit(): void {
        if (this.query) {
            this.lastName = this.query.lastName || undefined;
            this.date = this.query.date || undefined;
        }
    }

    emit(type, event) {
        switch (type) {
            case 'lastName':
                if (this.lastName) { this.query.lastName = this.lastName; } else { delete this.query.lastName; }
                break;
            case 'date':
                if (event.value) { this.query.date = event.value; } else { delete this.query.date; }
                break;
        }
        this.done.emit(this.query);
    }
}

